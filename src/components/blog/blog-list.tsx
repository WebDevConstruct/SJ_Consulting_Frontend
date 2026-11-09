"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getPublishedBlogs } from "@/lib/blog-service";
import type { BlogPost } from "@/lib/blog-types";

function formatDate(iso: string | null) {
  if (!iso) return "Unpublished";

  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      const data = await getPublishedBlogs();
      setBlogs(data);
      setIsLoading(false);
    }

    void loadBlogs();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return blogs;

    return blogs.filter((blog) => {
      const searchableText = [
        blog.title,
        blog.subtext,
        blog.summary ?? "",
        blog.author_name ?? "",
        ...(blog.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [blogs, query]);

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

        {isLoading ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-sm border border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-surface"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="mt-16 text-[15px] text-current/55">
            {blogs.length === 0
              ? "No published articles are available yet."
              : `No articles match “${query}”. Try a different search term.`}
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: (index % 3) * 0.08,
                }}
                className="group flex flex-col rounded-sm border border-paper-line bg-paper-soft p-7 transition-colors hover:border-gold-400/60 dark:border-ink-line dark:bg-ink-surface"
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="flex flex-1 flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-sm border border-paper-line bg-paper dark:border-ink-line dark:bg-ink">
                    {blog.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.cover_image_url}
                        alt={blog.cover_image_alt ?? blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-current/35">
                        SJ Consulting
                      </div>
                    )}
                  </div>

                  <span className="mt-5 text-[12.5px] text-current/45">
                    {formatDate(blog.published_at)}
                  </span>

                  <h2 className="mt-2 font-display text-[19px] leading-snug transition-colors group-hover:text-gold-600 dark:group-hover:text-gold-300">
                    {blog.title}
                  </h2>

                  <p className="mt-3 text-[14px] leading-relaxed text-current/60">
                    {blog.summary ?? blog.subtext}
                  </p>

                  {blog.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-paper-line px-3 py-1 text-[11px] uppercase tracking-wide text-current/55 dark:border-ink-line"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="mt-5 text-sm font-semibold
                   text-gold-700 transition-colors group-hover:text-gold-600 dark:text-gold-300">
                    Read article →
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}