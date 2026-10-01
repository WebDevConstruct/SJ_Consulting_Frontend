"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {usePathname} from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky ${pathname?.includes("dashboard") ? "hidden" : "block"} top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-paper-line dark:bg-ink/90 dark:border-ink-line"
          : "bg-transparent"
      }`}
    >
      <div className="container-content flex gap-5 h-16 items-center justify-between md:h-20">
     <div className="flex gap-2">
        <Image className="rounded-full w-10 h-10 border border-white" src="/images/logo.avif"  alt="Logo" width={60} height={60} />
        <Link
          href="/"
          className="focus-gold flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="font-display text-[22px] leading-none tracking-tight">
            SJ <span className="text-gold-foil">Consult</span>
          </span>
        </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-gold text-[14.5px] font-medium text-current/80 transition-colors hover:text-gold-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Link
            href="/signin"
            className="focus-gold text-[14.5px] font-medium hover:text-gold-500"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-5 py-2 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
          >
            Create account
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="focus-gold flex h-9 w-9 items-center justify-center rounded-full border border-ink-line/40 dark:border-ink-line"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Menu className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-content flex flex-col gap-1 border-t border-paper-line pb-6 pt-4 dark:border-ink-line">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="focus-gold rounded-sm px-2 py-3 text-[15px] font-medium hover:text-gold-500"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-3">
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="focus-gold px-2 py-2 text-[15px] font-medium hover:text-gold-500"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-5 py-3 text-center text-[14px] font-semibold text-ink shadow-gold"
            >
              Create account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
