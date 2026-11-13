import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const courseIdSchema = z.object({
  course_id: z.string().uuid(),
});

const startPaymentSchema = z.object({
  course_id: z.string().uuid(),
});

const updatePaymentSchema = z.object({
  payment_request_id: z.string().uuid(),
  action: z.enum(["claim_payment", "receipt_sent", "cancel"]),
});

const ACTIVE_STATUSES = [
  "pending_payment",
  "payment_claimed",
  "receipt_sent",
] as const;

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const courseId = request.nextUrl.searchParams.get("course_id");

    const parsedCourseId = courseIdSchema.safeParse({
      course_id: courseId,
    });

    if (!parsedCourseId.success) {
      return NextResponse.json(
        { error: "A valid course ID is required." },
        { status: 400 },
      );
    }

    const { data: paymentRequest } = await supabase
      .from("course_payment_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", parsedCourseId.data.course_id)
      .in("status", ACTIVE_STATUSES)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: access } = await supabase
      .from("course_access")
      .select("padlock")
      .eq("user_id", user.id)
      .eq("course_id", parsedCourseId.data.course_id)
      .maybeSingle();

    return NextResponse.json({
      course_id: parsedCourseId.data.course_id,
      payment_request: paymentRequest ?? null,
      access_status:
        access?.padlock === false ? "unlocked" : "locked",
    });
  } catch (error) {
    console.error("GET course payment state failed:", error);

    return NextResponse.json(
      { error: "Unable to check your payment status." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = startPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "A valid course ID is required." },
        { status: 400 },
      );
    }

    const courseId = parsed.data.course_id;

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, course_code, course_title, price_amount, price_currency, status")
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();

    if (courseError) throw courseError;

    if (!course) {
      return NextResponse.json(
        { error: "This course is not available for purchase." },
        { status: 404 },
      );
    }

    if (course.price_amount === null) {
      return NextResponse.json(
        { error: "This course is free and does not require payment." },
        { status: 409 },
      );
    }

    const { data: existingRequest } = await supabase
      .from("course_payment_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .in("status", ACTIVE_STATUSES)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRequest) {
      return NextResponse.json({
        success: true,
        payment_request: existingRequest,
      });
    }

    const { data: newRequest, error: insertError } = await supabase
      .from("course_payment_requests")
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount: course.price_amount,
        currency: course.price_currency ?? "NGN",
        payment_method: "manual_transfer",
        status: "pending_payment",
      })
      .select("*")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      payment_request: newRequest,
    });
  } catch (error) {
    console.error("POST course payment request failed:", error);

    return NextResponse.json(
      { error: "Unable to start this payment request." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = updatePaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment update request." },
        { status: 400 },
      );
    }

    const { payment_request_id, action } = parsed.data;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (action === "claim_payment") {
      updates.status = "payment_claimed";
      updates.claimed_at = new Date().toISOString();
    }

    if (action === "receipt_sent") {
      updates.status = "receipt_sent";
      updates.receipt_sent_at = new Date().toISOString();
    }

    if (action === "cancel") {
      updates.status = "cancelled";
      updates.cancelled_at = new Date().toISOString();
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from("course_payment_requests")
      .update(updates)
      .eq("id", payment_request_id)
      .eq("user_id", user.id)
      .in("status", ACTIVE_STATUSES)
      .select("*")
      .maybeSingle();

    if (updateError) throw updateError;

    if (!updatedRequest) {
      return NextResponse.json(
        {
          error:
            "This payment request is no longer active. Refresh the page.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      payment_request: updatedRequest,
    });
  } catch (error) {
    console.error("PATCH course payment request failed:", error);

    return NextResponse.json(
      { error: "Unable to update this payment request." },
      { status: 500 },
    );
  }
}