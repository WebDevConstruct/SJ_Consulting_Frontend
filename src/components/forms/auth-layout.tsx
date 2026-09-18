import type { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthLayoutProps) {
  return (
    <section className="bg-paper-soft dark:bg-ink-soft">
      <div className="container-content flex justify-center py-20 md:py-28">
        <div className="w-full max-w-md rounded-sm border border-paper-line bg-paper p-8 dark:border-ink-line dark:bg-ink-surface sm:p-10">
          <div className="h-[2px] w-10 bg-gold-metal" />
          <h1 className="mt-5 font-display text-[28px] leading-tight sm:text-[32px]">
            {title}
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-current/60">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-[13.5px] text-current/60">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="focus-gold font-medium text-gold-600 hover:underline dark:text-gold-300"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
