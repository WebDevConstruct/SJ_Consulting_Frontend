/**
 * Paystack Inline Checkout Helper — SJ Consulting
 *
 * Triggers the official Paystack inline popup modal.
 * Upon successful payment, the Supabase `paystack-webhook` Edge Function
 * verifies the transaction via HMAC-SHA512 and provisions the user's subscription.
 */

export interface PayWithPaystackParams {
  email: string;
  userId: string;
  amountKobo: number;
  planType: "cbt_premium" | "gst_year1" | "gst_year2";
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

export function payWithPaystack(params: PayWithPaystackParams): void {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!key) {
    alert(
      "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is missing. Please set your Paystack public key in .env.local."
    );
    return;
  }

  if (typeof window === "undefined" || !(window as any).PaystackPop) {
    alert("Paystack script is still loading. Please check your internet connection and try again.");
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key,
    email: params.email,
    amount: params.amountKobo,
    currency: "NGN",
    metadata: {
      user_id: params.userId,
      plan_type: params.planType,
    },
    callback: function (response: { reference: string }) {
      if (params.onSuccess) {
        params.onSuccess(response.reference);
      } else {
        alert("Payment successful! Your subscription is being activated.");
        window.location.reload();
      }
    },
    onClose: function () {
      if (params.onClose) params.onClose();
    },
  });

  handler.openIframe();
}
