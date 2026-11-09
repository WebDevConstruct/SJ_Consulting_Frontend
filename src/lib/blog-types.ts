export type BlogBlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "image"
  | "quote"
  | "list";

export interface BlogBlock {
  id: string;
  blog_id: string;
  position: number;
  block_type: BlogBlockType;
  heading: string | null;
  text: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  list_items: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtext: string;
  summary: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  reading_time_minutes: number | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_blocks: BlogBlock[];
}