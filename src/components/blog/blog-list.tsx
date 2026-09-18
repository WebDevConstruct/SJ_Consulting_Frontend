"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { blogPosts } from "@/lib/mock-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogList() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogPosts;
    return blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="bg-paper dark:bg-ink">
      <div className="container-content py-20 md:py-24">
        <div className="h-[2px] w-14 bg-gold-metal" />
        <h1 className="mt-7 max-w-xl font-display text-[36px] leading-tight sm:text-[46px]">
          Blog & performance
        </h1>
        <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-current/65">
          What our departments are noticing, and how the platform has moved
          aspirants and undergraduates forward.
        </p>

        <div className="relative mt-10 max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-current/40"
            strokeWidth={1.8}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            aria-label="Search blog posts"
            className="focus-gold w-full rounded-sm border border-paper-line bg-paper py-3 pl-11 pr-4 text-[14.5px] text-current placeholder:text-current/40 dark:border-ink-line dark:bg-ink-surface"
          />
        </div>

        {results.length === 0 ? (
          <p className="mt-16 text-[15px] text-current/55">
            No articles match &ldquo;{query}&rdquo;. Try a different search
            term.
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                className="group flex flex-col rounded-sm border border-paper-line bg-paper-soft p-7 transition-colors hover:border-gold-400/60 dark:border-ink-line dark:bg-ink-surface"
              >
                <div className="aspect-[16/10] w-full rounded-sm border border-paper-line bg-paper dark:border-ink-line dark:bg-ink" />
                <span className="mt-5 text-[12.5px] text-current/45">
                  {formatDate(post.date)}
                </span>
                <h2 className="mt-2 font-display text-[19px] leading-snug transition-colors group-hover:text-gold-600 dark:group-hover:text-gold-300">
                  {post.title}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-current/60">
                  {post.summary}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
