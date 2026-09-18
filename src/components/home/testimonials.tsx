"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft"
    >
      <div className="container-content py-24 md:py-32">
        <div className="max-w-xl">
          <h2 className="font-display text-[32px] leading-tight sm:text-[38px]">
            Results, in their own words.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-current/65">
            A small sample of the aspirants and undergraduates using SJ
            Consult this session.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.12 }}
              className="animate-floaty rounded-sm border border-paper-line bg-paper p-7 dark:border-ink-line dark:bg-ink-surface"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Quote
                className="h-5 w-5 text-gold-400"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-current/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-current/10 pt-4 text-[13.5px]">
                <span className="font-semibold">{t.name}</span>
                <span className="text-current/50"> &middot; {t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
