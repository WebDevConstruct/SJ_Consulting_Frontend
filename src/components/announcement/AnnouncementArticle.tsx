// components/AnnouncementArticle.tsx
// components/announcements/AnnouncementArticle.tsx
import Image from "next/image";
import Link from "next/link";
import type { AnnouncementRecord } from "@/types/announcementTypes";
import {FormattedAnnouncementContent} from "./FormattedAnnouncement"
type AnnouncementArticleProps = {
  announcement: AnnouncementRecord;
  relatedAnnouncements: AnnouncementRecord[];
};

const categoryLabels = {
  mentorship: "Mentorship Update",
  unilag: "UNILAG Update",
  jamb: "JAMB Update",
  accommodation: "Accommodation Update",
} as const;

const categoryStyles = {
  mentorship:
    "bg-amber-100 text-amber-900 border-amber-300",
  unilag:
    "bg-slate-100 text-slate-900 border-slate-300",
  jamb:
    "bg-emerald-100 text-emerald-900 border-emerald-300",
  accommodation:
    "bg-rose-100 text-rose-900 border-rose-300",
} as const;

function formatDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function AnnouncementArticle({
  announcement,
  relatedAnnouncements,
}: AnnouncementArticleProps) {
  const publishedDate = formatDate(announcement.created_at);
  const eventDate = formatDate(announcement.event_date || "");

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[announcement.category]}`}
          >
            {categoryLabels[announcement.category]}
          </span>

          {publishedDate && (
            <span className="text-sm text-neutral-500">
              Published {publishedDate}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
          {announcement.title}
        </h1>

        <p className="text-lg leading-relaxed text-neutral-600">
          {announcement.summary}
        </p>

        <p className="text-sm text-neutral-500">
      {announcement?.source_name ?  `By ${announcement.source_name}` : ""}
        </p>
      </header>

      {announcement.image_url && (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <Image
            src={announcement.image_url}
            alt={announcement.title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            priority
          />
        </figure>
      )}

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Key information
        </h2>

        <dl className="grid gap-4 sm:grid-cols-2">
          {eventDate && (
            <div>
              <dt className="text-xs font-medium text-neutral-500">
                Event date
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900">
                {eventDate}
              </dd>
            </div>
          )}

          {announcement.location && (
            <div>
              <dt className="text-xs font-medium text-neutral-500">
                Location
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900">
                {announcement.location}
              </dd>
            </div>
          )}

          {announcement.link && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-neutral-500">
                Official information
              </dt>
              <dd className="mt-1">
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
                >
                  View source or apply
                  <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-10">
        <article className="prose prose-neutral max-w-none prose-headings:font-semibold prose-a:text-amber-700">
          <FormattedAnnouncementContent content={announcement.content} />
        </article>
      </section>

      {relatedAnnouncements.length > 0 && (
        <section className="mt-14 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-900">
            Similar updates
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {relatedAnnouncements.map((related) => (
              <Link
                key={related.id}
                href={`/${related?.category}/${related.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {categoryLabels[related.category]}
                </span>

                <h3 className="mt-2 line-clamp-2 font-medium text-neutral-900 group-hover:text-amber-800">
                  {related.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                  {related.subtext}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}