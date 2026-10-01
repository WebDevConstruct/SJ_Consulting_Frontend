"use client"

import Link from "next/link";
import { AtSign, Mail, Phone, Send } from "lucide-react";
import {usePathname} from "next/navigation";
const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Services", href: "/services" },
      { label: "About SJ Consult", href: "/about" },
      { label: "Blog & performance", href: "/blog" },
      { label: "Create an account", href: "/signup" },
    ],
  },
  {
    title: "For aspirants",
    links: [
      { label: "JAMB guidelines", href: "/services" },
      { label: "UTME calculator", href: "/services" },
      { label: "Practice CBT questions", href: "/signup" },
      { label: "Scholarships & mentorship", href: "/services" },
    ],
  },
  {
    title: "For undergraduates",
    links: [
      { label: "GST resources", href: "/services" },
      { label: "Accommodation desk", href: "/services" },
      { label: "Course documents", href: "/services" },
      { label: "Sign in to dashboard", href: "/signin" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className={`${pathname?.includes("dashboard") ? "hidden" : "block"} border-t border-ink-line bg-ink text-ivory`}>
      <div className="container-content py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-[22px] leading-none">
              SJ <span className="text-gold-foil">Consult</span>
            </span>
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-ivory/60">
              Precise, verified guidance for JAMB aspirants and UNILAG
              undergraduates &mdash; from first application to final result.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="mailto:hello@sjconsult.ng"
                aria-label="Email SJ Consult"
                className="focus-gold text-ivory/50 transition-colors hover:text-gold-300"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
              <a
                href="tel:+2340000000000"
                aria-label="Call SJ Consult"
                className="focus-gold text-ivory/50 transition-colors hover:text-gold-300"
              >
                <Phone className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                aria-label="SJ Consult on Telegram"
                className="focus-gold text-ivory/50 transition-colors hover:text-gold-300"
              >
                <Send className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                aria-label="SJ Consult on Instagram"
                className="focus-gold text-ivory/50 transition-colors hover:text-gold-300"
              >
                <AtSign className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold text-ivory/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="focus-gold text-[14.5px] text-ivory/75 transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink-line pt-8 text-[13px] text-ivory/40 md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} SJ Consult. All rights reserved.</p>
          <p>Lagos, Nigeria &middot; Built for JAMB, WAEC, NECO & NABTEB candidates</p>
        </div>
      </div>
    </footer>
  );
}
