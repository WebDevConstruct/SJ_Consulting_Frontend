"use client";

import { useEffect, useState } from "react";

import { Copy, CheckCircle2, Clock, MessageCircle, X } from "lucide-react";

import { Button } from "@components/Button";
import { useStatusToast } from "@/components/ui/status-toast";

import type {
  CoursePaymentRequest,
  CoursePaymentStatus,
  StudentCourse,
} from "./cbt-types";

type CoursePaymentModalProps = {
  open: boolean;
  course: StudentCourse | null;
  onClose: () => void;
  onAccessGranted: (course: StudentCourse) => void;
};

const WHATSAPP_NUMBER = "2348012345678";

const stateCopy: Record<
  CoursePaymentStatus,
  {
    title: string;
    description: string;
  }
> = {
  pending_payment: {
    title: "Complete your payment",
    description:
      "Transfer the exact course fee to the SJ Consults account below, then confirm that you have made the payment.",
  },
  payment_claimed: {
    title: "Payment recorded",
    description:
      "We have saved your payment confirmation. Send your payment receipt to SJ Consults on WhatsApp for verification.",
  },
  receipt_sent: {
    title: "Awaiting confirmation",
    description:
      "Your payment request is being reviewed. You will be able to access the course once SJ Consults confirms the transfer.",
  },
  approved: {
    title: "Payment confirmed",
    description: "Your course access has been activated.",
  },
  rejected: {
    title: "Payment could not be verified",
    description:
      "Please contact SJ Consults or start a new payment request after resolving the issue.",
  },
  cancelled: {
    title: "Payment request cancelled",
    description: "You can start a new payment request at any time.",
  },
  expired: {
    title: "Course access expired",
    description: "Renew your access to continue using this course.",
  },
};

export function CoursePaymentModal({
  open,
  course,
  onClose,
  onAccessGranted,
}: CoursePaymentModalProps) {
  const { showToast } = useStatusToast();

  const [paymentRequest, setPaymentRequest] =
    useState<CoursePaymentRequest | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !course) return;

    const checkExistingRequest = async () => {
      setChecking(true);

      try {
        const response = await fetch(
          `/api/student/cbt/payment?course_id=${course.id}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ?? "Unable to check your payment status.",
          );
        }

        setPaymentRequest(result.payment_request);
      } catch (error) {
        showToast({
          kind: "error",
          title: "Payment check failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to check your payment status.",
        });
      } finally {
        setChecking(false);
      }
    };

    void checkExistingRequest();
  }, [open, course, showToast]);

  if (!open || !course) return null;

  const status: CoursePaymentStatus =
    paymentRequest?.status ?? "pending_payment";

  const copy = stateCopy[status];

  const startPayment = async () => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/student/cbt/payment", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to start this payment request.",
        );
      }

      setPaymentRequest(result.payment_request);
    } catch (error) {
      showToast({
        kind: "error",
        title: "Payment error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to start this payment request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const claimPayment = async () => {
    if (!paymentRequest) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/student/cbt/payment", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_request_id: paymentRequest.id,
          action: "claim_payment",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to save your payment confirmation.",
        );
      }

      setPaymentRequest(result.payment_request);

      showToast({
        kind: "success",
        title: "Payment recorded",
        message: "Now send your receipt to SJ Consults on WhatsApp.",
      });
    } catch (error) {
      showToast({
        kind: "error",
        title: "Payment update failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save your payment confirmation.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sendReceipt = async () => {
    if (!paymentRequest) return;

    const message = [
      "Hello SJ Consults,",
      "",
      `I have made a payment for ${course.course_code} - ${course.course_title}.`,
      `Amount: ${paymentRequest.currency} ${paymentRequest.amount}`,
      `Payment reference: ${paymentRequest.id}`,
      "",
      "Please find my payment receipt attached.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setSubmitting(true);

    try {
      const response = await fetch("/api/student/cbt/payment", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_request_id: paymentRequest.id,
          action: "receipt_sent",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to update your receipt status.",
        );
      }

      setPaymentRequest(result.payment_request);
    } catch (error) {
      showToast({
        kind: "error",
        title: "Receipt update failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update your receipt status.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyAccountNumber = async () => {
    const accountNumber = "0123456789";

    try {
      await navigator.clipboard.writeText(accountNumber);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        kind: "error",
        title: "Copy failed",
        message: "Please copy the account number manually.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-paper-line bg-paper dark:border-ink-line dark:bg-ink-soft">
        <div className="flex items-start justify-between gap-4 border-b border-paper-line p-5 dark:border-ink-line">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-200">
              {course.course_code}
            </p>

            <h2 className="mt-1 font-display text-xl font-bold">
              {copy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment window"
            className="rounded-full p-2 text-ink/50 transition hover:text-ink dark:text-paper/50 dark:hover:text-paper"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm leading-6 text-ink/70 dark:text-paper/70">
            {copy.description}
          </p>

          {checking ? (
            <div className="mt-6 rounded-xl border border-paper-line bg-paper-soft p-4 text-sm text-ink/60 dark:border-ink-line dark:bg-ink dark:text-paper/60">
              Checking your existing payment request…
            </div>
          ) : (
            <>
              {status === "pending_payment" && (
                <div className="mt-6 rounded-xl border border-gold-400/40 bg-gold-metal-soft p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55">
                        Amount
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {paymentRequest
                          ? `${paymentRequest.currency} ${paymentRequest.amount}`
                          : `${course.currency} ${course.price}`}
                      </p>
                    </div>

                    <Button
                      text={copied ? "Copied" : "Copy account"}
                      type="button"
                      onClick={copyAccountNumber}
                    />
                  </div>

                  <div className="mt-4 space-y-1 text-sm">
                    <p className="font-semibold">SJ Consults</p>
                    <p className="text-ink/70 dark:text-paper/70">
                      Account number: 0123456789
                    </p>
                    <p className="text-ink/70 dark:text-paper/70">
                      Bank: Your bank name
                    </p>
                  </div>
                </div>
              )}

              {status === "payment_claimed" && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />

                  <p className="text-sm text-ink/75 dark:text-paper/75">
                    Your payment confirmation has been saved. Send the
                    receipt to complete verification.
                  </p>
                </div>
              )}

              {status === "receipt_sent" && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-400/40 bg-gold-metal-soft p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-300" />

                  <p className="text-sm text-ink/75 dark:text-paper/75">
                    SJ Consults is reviewing your payment. You can safely
                    close this page and return later.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                {status === "pending_payment" && (
                  <Button
                    className="w-full"
                    text={
                      submitting
                        ? "Saving confirmation…"
                        : "I have made payment"
                    }
                    type="button"
                    disabled={submitting}
                    onClick={claimPayment}
                  />
                )}

                {status === "payment_claimed" && (
                  <Button
                    className="w-full"
                    text={
                      submitting
                        ? "Opening WhatsApp…"
                        : "Send receipt to SJ Consults"
                    }
                    type="button"
                    disabled={submitting}
                    onClick={sendReceipt}
                  />
                )}

                {status === "receipt_sent" && (
                  <Button
                    className="w-full"
                    text="Close"
                    type="button"
                    onClick={onClose}
                  />
                )}

                {status === "approved" && (
                  <Button
                    className="w-full"
                    text="Study course"
                    type="button"
                    onClick={() => onAccessGranted(course)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}