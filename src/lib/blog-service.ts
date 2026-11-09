import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/blog-types";
import { createBrowserClient } from "@supabase/ssr";
//import {createServer} from "@lib/supabase/servercomp"
//const supabase = createClient();
 const createServerClient  = async()=> {
     return createBrowserClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL || "",
         process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
     )
 }
 const supabaseServer = await createServerClient();
const blogSelect = `
  id,
  slug,
  title,
  subtext,
  summary,
  cover_image_url,
  cover_image_alt,
  author_name,
  reading_time_minutes,
  tags,
  is_published,
  published_at,
  created_at,
  updated_at,
  blog_blocks (
    id,
    blog_id,
    position,
    block_type,
    heading,
    text,
    image_url,
    image_alt,
    image_caption,
    list_items,
    created_at,
    updated_at
  )
`;

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabaseServer
    .from("blogs")
    .select(blogSelect)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("position", {
      ascending: true,
      referencedTable: "blog_blocks",
    });

  if (error) {
    console.error("Error fetching published blogs:", error);
    return [];
  }

  return (data ?? []) as BlogPost[];
}

export async function getPublishedBlogBySlug(
  slug: string
): Promise<BlogPost | null> {
    try {
  const { data, error } = await supabaseServer
    .from("blogs")
    .select(blogSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .order("position", {
      ascending: true,
      referencedTable: "blog_blocks",
    })
    .maybeSingle();

  if (error) {
    console.error("Error fetching blog:", error );
    return null;
  }
  console.log(data);
   return (data as BlogPost) ?? null;
}catch(error){
    console.error("Error fetching blog:", error);
    return null;
}

 
}