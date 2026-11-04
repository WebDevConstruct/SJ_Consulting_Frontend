"use client";

import { useState } from "react";

import PricingCatalogue, {
  type PricingProduct,
} from "@/components/pricing/PricingCatalogue";

import { pricingDemoProducts } from
  "@/components/pricing/pricing-demo-data";

export default function PricingPage() {
  const [purchaseNotice, setPurchaseNotice] = useState("");

  function handleBuy(product: PricingProduct) {
    setPurchaseNotice(
      `You selected ${product.title}. Checkout is not connected yet.`,
    );
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