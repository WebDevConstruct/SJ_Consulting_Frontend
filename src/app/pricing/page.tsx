"use client";

import { useState } from "react";

import PricingCatalogue, {
  type PricingProduct,
} from "@/components/pricing/PricingCatalogue";

import { pricingDemoProducts } from "@/components/pricing/pricing-demo-data";
import { payWithPaystack } from "@/lib/paystack";
import { createClient } from "@/lib/supabase/client";

export default function PricingPage() {
  const [purchaseNotice, setPurchaseNotice] = useState("");
  const supabase = createClient();

  async function handleBuy(product: PricingProduct) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPurchaseNotice("Please sign in or create an account to purchase a subscription.");
      window.location.href = "/signin?redirect=/pricing";
      return;
    }

    const planType =
      product.id.includes("gst") || product.title.toLowerCase().includes("gst")
        ? "gst_year1"
        : "cbt_premium";

    const amountKobo = Math.round((product.price || 5000) * 100);

    payWithPaystack({
      email: user.email || "",
      userId: user.id,
      amountKobo: amountKobo > 0 ? amountKobo : 500000,
      planType,
      onSuccess: (ref) => {
        setPurchaseNotice(`Payment successful! Reference: ${ref}. Subscription activated.`);
      },
      onClose: () => {
        setPurchaseNotice("Transaction closed.");
      },
    });
  }

  return (
    <main>
      <PricingCatalogue
        products={pricingDemoProducts}
        onBuy={handleBuy}
      />

      {purchaseNotice && (
        <div
          role="status"
          className="
            fixed bottom-6 left-1/2 z-50
            w-[calc(100%-2rem)] max-w-md -translate-x-1/2
            rounded-2xl border border-gold-400/40
            bg-ivory p-5 text-sm text-ink
            dark:bg-ink-surface dark:text-paper
          "
        >
          <p>{purchaseNotice}</p>

          <button
            type="button"
            onClick={() => setPurchaseNotice("")}
            className="
              mt-3 rounded px-2 py-1 font-semibold
              text-gold-700
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-gold-500
              dark:text-gold-200
            "
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}