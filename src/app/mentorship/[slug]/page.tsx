import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementArticle } from "@/components/announcement/AnnouncementArticle";
import type { AnnouncementRecord } from "@/types/announcementTypes";

type AnnouncementPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getAnnouncement(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle<AnnouncementRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export async function generateMetadata({
  params,
}: AnnouncementPageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) {
    return {
      title: "Announcement not found",
    };
  }

  return {
    title: announcement.title,
    description:
      announcement.summary ?? announcement.subtext,
    openGraph: {
      title: announcement.title,
      description:
        announcement.summary ?? announcement.subtext,
      images: announcement.image_url
        ? [announcement.image_url]
        : undefined,
    },
  };
}

export default async function AnnouncementPage({
  params,
}: AnnouncementPageProps) {
  const { slug } = await params;

  const announcement = await getAnnouncement(slug);

  if (!announcement) {
    notFound();
  }

  const supabase = await createClient();

  const { data: relatedAnnouncements } = await supabase
    .from("announcements")
    .select("*")
    .eq("category", announcement.category)
    .eq("is_published", true)
    .neq("id", announcement.id)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <AnnouncementArticle
      announcement={announcement}
      relatedAnnouncements={relatedAnnouncements ?? []}
    />
  );
}