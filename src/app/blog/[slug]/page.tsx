
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug } from "@/lib/blog-service";

function formatDate(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog= await getPublishedBlogBySlug(slug);
  // console.log(blog);

  if (!blog) {
    notFound();
  }

  return (
    <article className="bg-paper dark:bg-ink">
      <div className="container-content py-16 md:py-20">
        <Link
          href="/blog"
          className="inline-block text-sm font-semibold text-gold-700 hover:underline dark:text-gold-300"
        >
          ← Back to blog
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-current/45">
            <span>{formatDate(blog.published_at)}</span>

            {blog.author_name ? (
              <>
                <span>·</span>
                <span>By {blog.author_name}</span>
              </>
            ) : null}

            {blog.reading_time_minutes ? (
              <>
                <span>·</span>
                <span>{blog.reading_time_minutes} min read</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-[38px] leading-tight sm:text-[52px]">
            {blog.title}
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-current/65">
            {blog.subtext}
          </p>

          {blog.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-paper-line px-3 py-1 text-[11px] uppercase tracking-wide text-current/55 dark:border-ink-line"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {blog.cover_image_url ? (
          <figure className="mt-12">
            <div className="overflow-hidden rounded-sm border border-paper-line dark:border-ink-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.cover_image_url}
                alt={blog.cover_image_alt ?? blog.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            {blog.cover_image_alt ? (
              <figcaption className="mt-3 text-sm text-current/45">
                {blog.cover_image_alt}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="mx-auto mt-14 max-w-3xl space-y-8">
          {blog.blog_blocks.map((block) => {
            switch (block.block_type) {
              case "heading":
                return (
                  <h2
                    key={block.id}
                    className="font-display text-[28px] leading-snug sm:text-[34px]"
                  >
                    {block.heading}
                  </h2>
                );

              case "subheading":
                return (
                  <h3
                    key={block.id}
                    className="font-display text-[22px] leading-snug sm:text-[26px]"
                  >
                    {block.heading}
                  </h3>
                );

              case "paragraph":
                return (
                  <p
                    key={block.id}
                    className="text-[16.5px] leading-relaxed text-current/75"
                  >
                    {block.text}
                  </p>
                );

              case "image":
                return (
                  <figure key={block.id} className="my-10">
                    <div className="overflow-hidden rounded-sm border border-paper-line dark:border-ink-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={block.image_url ?? ""}
                        alt={block.image_alt ?? ""}
                        className="w-full object-cover"
                      />
                    </div>

                    {block.image_caption ? (
                      <figcaption className="mt-3 text-sm text-current/45">
                        {block.image_caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );

              case "quote":
                return (
                  <blockquote
                    key={block.id}
                    className="border-l-4 border-gold-metal pl-5 font-display text-[22px] leading-snug text-current/80"
                  >
                    {block.text}
                  </blockquote>
                );

              case "list":
                return (
                  <ul
                    key={block.id}
                    className="space-y-3 text-[16.5px] leading-relaxed text-current/75"
                  >
                    {(block.list_items ?? []).map((item, index) => (
                      <li key={`${block.id}-${index}`} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-metal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </article>
  );
}