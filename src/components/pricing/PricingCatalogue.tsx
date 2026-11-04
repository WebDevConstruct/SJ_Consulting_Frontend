"use client";

import {
  useId,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

export type PricingAudience = "aspirant" | "undergraduate";

export type PricingIcon =
  | "book"
  | "chart"
  | "calculator"
  | "science"
  | "language";

export interface PricingProduct {
  id: string;
  audience: PricingAudience;

  /**
   * Aspirant example: Economics PQ
   * Undergraduate example: GST 101
   */
  title: string;

  /** Short two-word phrase. */
  subtitle: string;

  /** Subject name or full course title. */
  subject: string;

  /** Product-specific objective or description. */
  objective: string;

  /**
   * Amount in the currency's main unit.
   * For example, 2500 represents NGN 2,500.
   * null means the price has not been supplied.
   */
  price: number | null;

  currency: string;
  icon?: PricingIcon;

  /** Optional commercial terms; do not invent these. */
  purchaseNote?: string;

  /** Disable purchasing without hiding the product. */
  available?: boolean;
}

interface PricingCatalogueProps {
  products: readonly PricingProduct[];
  onBuy: (product: PricingProduct) => void | Promise<void>;

  defaultAudience?: PricingAudience;
  heading?: string;
  description?: string;

  loading?: boolean;
  errorMessage?: string | null;

  /** Controlled by the parent during checkout initialization. */
  purchasingProductId?: string | null;

  className?: string;
}

type IconProps = {
  kind?: PricingIcon;
  className?: string;
};

const AUDIENCES: {
  value: PricingAudience;
  label: string;
  hint: string;
}[] = [
  {
    value: "aspirant",
    label: "Aspirant",
    hint: "Explore subject-based past questions for aspirants.",
  },
  {
    value: "undergraduate",
    label: "Undergraduate",
    hint: "Explore past questions by course code or course title.",
  },
];

function ProductIcon({
  kind = "book",
  className = "",
}: IconProps) {
  const paths: Record<PricingIcon, React.ReactNode> = {
    book: (
      <>
        <path d="M12 6v15" />
        <path d="M3 4.5h4a6 6 0 0 1 5 2 6 6 0 0 1 5-2h4v15h-4a6 6 0 0 0-5 2 6 6 0 0 0-5-2H3z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17" />
        <path d="m7 14 4-4 4 2 5-7" />
        <path d="M16 5h4v4" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M8 6h8M8 10h2m4 0h2M8 14h2m4 0h2M8 18h2m4 0h2" />
      </>
    ),
    science: (
      <>
        <path d="M9 3h6M10 3v6l-6 10a1.3 1.3 0 0 0 1.1 2h13.8a1.3 1.3 0 0 0 1.1-2L14 9V3" />
        <path d="M8 14h8" />
      </>
    ),
    language: (
      <>
        <path d="M3 5h12M9 3v2M5 5c0 6 4 9 9 11M13 5c0 5-4 10-10 12" />
        <path d="m14 21 4-10 4 10M15.5 17h5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function formatPrice(product: PricingProduct) {
  if (product.price === null) return "Price pending";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: product.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(product.price);
}

function PricingCard({
  product,
  onBuy,
  purchasing,
}: {
  product: PricingProduct;
  onBuy: PricingCatalogueProps["onBuy"];
  purchasing: boolean;
}) {
  const headingId = useId();

  const disabled =
    product.available === false ||
    product.price === null ||
    purchasing;

  const buttonLabel = purchasing
    ? "Please wait…"
    : product.available === false
      ? "Coming soon"
      : product.price === null
        ? "Price pending"
        : "Buy now";

  return (
    <article
      aria-labelledby={headingId}
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-2xl border border-paper-line bg-ivory p-6
        transition-[transform,border-color] duration-300
        hover:-translate-y-1 hover:border-gold-400/60
        motion-reduce:transform-none motion-reduce:transition-none
        dark:border-ink-line dark:bg-ink-soft
        dark:hover:border-gold-500/60
      "
    >
      {/* Quiet decorative engraving. */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -bottom-16 -right-16
          h-44 w-44 rounded-full border border-gold-400/10
        "
      >
        <div className="absolute inset-5 rounded-full border border-gold-400/10" />
        <div className="absolute inset-10 rounded-full border border-gold-400/10" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl border border-gold-200 bg-gold-50
              text-gold-600 dark:border-gold-600/30
              dark:bg-gold-400/10 dark:text-gold-200
            "
          >
            <ProductIcon kind={product.icon} className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3
              id={headingId}
              className="
                break-words text-base font-semibold leading-snug
                text-ink dark:text-paper
              "
            >
              {product.title}
            </h3>

            <p
              className="
                mt-1 text-xs leading-relaxed
                text-ink/60 dark:text-paper/60
              "
            >
              {product.subtitle}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p
            className="
              text-base font-semibold tracking-tight
              text-ink dark:text-paper
            "
          >
            {formatPrice(product)}
          </p>

          <span
            className="
              mt-1 block text-[10px] uppercase tracking-[0.16em]
              text-gold-700 dark:text-gold-200
            "
          >
            Past questions
          </span>
        </div>
      </div>

      <div className="relative mt-7 flex-1">
        <p
          className="
            text-[10px] font-semibold uppercase tracking-[0.2em]
            text-gold-700 dark:text-gold-200
          "
        >
          {product.audience === "undergraduate"
            ? "Course subject"
            : "Subject focus"}
        </p>

        <h4
          className="
            mt-2 font-display text-2xl leading-tight
            tracking-tight text-ink dark:text-paper
          "
        >
          {product.subject}
        </h4>

        <p
          className="
            mt-3 text-sm leading-7
            text-ink/70 dark:text-paper/70
          "
        >
          {product.objective}
        </p>
      </div>

      <div className="relative mt-7">
        {product.purchaseNote && (
          <p
            className="
              mb-3 text-xs leading-relaxed
              text-ink/60 dark:text-paper/60
            "
          >
            {product.purchaseNote}
          </p>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => void onBuy(product)}
          aria-label={`${buttonLabel}: ${product.title}`}
          aria-busy={purchasing}
          className="
            flex w-full items-center justify-between gap-3
            rounded-xl border border-gold-500/40
            bg-gold-metal-soft px-5 py-3.5
            text-sm font-semibold text-ink
            transition-[filter,transform] duration-200
            hover:brightness-105 active:translate-y-px
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-gold-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-ivory
            disabled:cursor-not-allowed disabled:opacity-50
            motion-reduce:transform-none motion-reduce:transition-none
            dark:focus-visible:ring-offset-ink-soft
          "
        >
          <span>{buttonLabel}</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function PricingCatalogue({
  products,
  onBuy,
  defaultAudience = "aspirant",
  heading = "Affordable Pricing meets quality and trustworthy service",
  description = 'Purchase past questions at a rate where “utility meets demand”—and invest in assets that create long-term benefits.',
  loading = false,
  errorMessage = null,
  purchasingProductId = null,
  className = "",
}: PricingCatalogueProps) {
  const [audience, setAudience] =
    useState<PricingAudience>(defaultAudience);

  // Preserve each audience's own search when switching.
  const [queries, setQueries] = useState<
    Record<PricingAudience, string>
  >({
    aspirant: "",
    undergraduate: "",
  });

  const headingId = useId();
  const searchId = useId();

  const query = queries[audience];

  const audienceProducts = useMemo(
    () => products.filter((product) => product.audience === audience),
    [products, audience],
  );

  const filteredProducts = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (!normalized) return audienceProducts;

    return audienceProducts.filter((product) => {
      const searchable = normalizeSearch(
        `${product.title} ${product.subject}`,
      );

      return searchable.includes(normalized);
    });
  }, [audienceProducts, query]);

  const sectionStyle = {
    "--pricing-beige": "#F5F5DC",
  } as CSSProperties;

  return (
    <section
      aria-labelledby={headingId}
      style={sectionStyle}
      className={`
        relative isolate overflow-hidden
        bg-[var(--pricing-beige)] px-4 py-16
        text-ink dark:bg-ink dark:text-paper
        sm:px-6 sm:py-20 lg:px-8 lg:py-24
        ${className}
      `}
    >
      {/* Decorative background, deliberately kept behind content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="
            absolute inset-0 bg-ledger-light opacity-40
            dark:bg-ledger-dark dark:opacity-30
          "
        />

        <div
          className="
            absolute -left-44 -top-44 h-[34rem] w-[34rem]
            rounded-full border border-gold-500/15
          "
        >
          <div className="absolute inset-10 rounded-full border border-gold-500/10" />
          <div className="absolute inset-20 rounded-full border border-gold-500/10" />
        </div>

        <div
          className="
            absolute -bottom-56 -right-40 h-[40rem] w-[40rem]
            rotate-12 rounded-[5rem] border border-gold-500/10
          "
        >
          <div className="absolute inset-10 rounded-[4rem] border border-gold-500/10" />
        </div>
      </div>

      <div className="mx-auto max-w-content">
        <header className="mx-auto max-w-3xl text-center">
          <p
            className="
              text-xs font-semibold uppercase tracking-[0.24em]
              text-gold-700 dark:text-gold-200
            "
          >
           
          </p>

          <h1
            id={headingId}
            className="
              mt-5 font-display text-4xl font-bold
              leading-[1.12] tracking-tightest
              text-ink dark:text-paper
              sm:text-5xl lg:text-6xl
            "
          >
            {heading}
          </h1>

          <p
            className="
              mx-auto mt-5 max-w-2xl text-base leading-8
              text-ink/70 dark:text-paper/70
            "
          >
            {description}
          </p>
        </header>

        <div className="mt-9 flex justify-center">
          <div
            role="group"
            aria-label="Choose your pricing audience"
            className="
              relative inline-flex w-full max-w-sm
              rounded-full border border-paper-line
              bg-paper-surface p-1.5
              dark:border-ink-line dark:bg-ink-surface
            "
          >
            {/* Sliding off-white selection surface. */}
            <span
              aria-hidden="true"
              className={`
                pointer-events-none absolute bottom-1.5 left-1.5 top-1.5
                w-[calc(50%-0.375rem)] rounded-full
                border border-paper-line bg-ivory
                transition-transform duration-300 ease-in-out
                motion-reduce:transition-none
                ${
                  audience === "undergraduate"
                    ? "translate-x-full"
                    : "translate-x-0"
                }
              `}
            />

            {AUDIENCES.map((option) => {
              const selected = audience === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  title={option.hint}
                  onClick={() => setAudience(option.value)}
                  className={`
                    relative z-10 flex-1 rounded-full
                    px-3 py-3 text-sm font-semibold
                    transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-gold-500
                    motion-reduce:transition-none
                    ${
                      selected
                        ? "text-gold-700"
                        : "text-ink/65 hover:text-ink dark:text-paper/70 dark:hover:text-paper"
                    }
                  `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <label htmlFor={searchId} className="sr-only">
            {audience === "aspirant"
              ? "Search by subject"
              : "Search by course code or course title"}
          </label>

          <div className="relative">
            <SearchIcon
              className="
                pointer-events-none absolute left-4 top-1/2
                h-5 w-5 -translate-y-1/2
                text-gold-700 dark:text-gold-200
              "
            />

            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) =>
                setQueries((previous) => ({
                  ...previous,
                  [audience]: event.target.value,
                }))
              }
              placeholder={
                audience === "aspirant"
                  ? "Search by subject"
                  : "Search by course code or course title"
              }
              className="
                w-full rounded-2xl border border-paper-line
                bg-ivory py-4 pl-12 pr-4 text-sm text-ink
                placeholder:text-ink/50
                focus:border-gold-500 focus:outline-none
                focus:ring-2 focus:ring-gold-400/20
                dark:border-ink-line dark:bg-ink-soft
                dark:text-paper dark:placeholder:text-paper/50
              "
            />
          </div>
        </div>

        <div
          className="
            mb-5 mt-10 flex flex-wrap items-center
            justify-between gap-2
          "
        >
          <h2 className="font-display text-2xl text-ink dark:text-paper">
            {audience === "aspirant"
              ? "Prepare with purpose."
              : "Build on what you know."}
          </h2>

          <p
            role="status"
            className="text-xs text-ink/60 dark:text-paper/60"
          >
            {loading
              ? "Loading catalogue…"
              : errorMessage
                ? "Catalogue unavailable"
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "resource" : "resources"
                  }`}
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="
              rounded-2xl border border-gold-400/40
              bg-ivory p-8 text-center text-sm
              text-ink dark:bg-ink-soft dark:text-paper
            "
          >
            {errorMessage}
          </div>
        ) : loading ? (
          <div
            role="status"
            className="
              rounded-2xl border border-paper-line
              bg-ivory p-12 text-center
              dark:border-ink-line dark:bg-ink-soft
            "
          >
            Preparing your catalogue…
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="
              rounded-2xl border border-paper-line
              bg-ivory p-12 text-center
              dark:border-ink-line dark:bg-ink-soft
            "
          >
            <h3 className="font-display text-2xl">
              {query.trim()
                ? "No matching past questions."
                : "Your next chapter is on its way."}
            </h3>

            <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">
              {query.trim()
                ? "Try another subject, course code, or course title."
                : "Resources for this audience will appear here once published."}
            </p>

            {query.trim() && (
              <button
                type="button"
                onClick={() =>
                  setQueries((previous) => ({
                    ...previous,
                    [audience]: "",
                  }))
                }
                className="
                  mt-5 rounded-lg px-3 py-2
                  text-sm font-semibold text-gold-700
                  underline underline-offset-4
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-gold-500
                  dark:text-gold-200
                "
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="-m-3 flex flex-wrap">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-full p-3 md:w-1/2 xl:w-1/3"
              >
                <PricingCard
                  product={product}
                  onBuy={onBuy}
                  purchasing={purchasingProductId === product.id}
                />
              </div>
            ))}
          </div>
        )}

        <p
          className="
            mx-auto mt-10 max-w-xl text-center
            text-xs leading-6 text-ink/55 dark:text-paper/55
          "
        >
          Choose resources for your learning journey.
          Review the product details and purchase terms before checkout.
        </p>
      </div>
    </section>
  );
}