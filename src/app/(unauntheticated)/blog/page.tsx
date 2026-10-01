import type { Metadata } from "next";
import { BlogList } from "@/components/blog/blog-list";

export const metadata: Metadata = {
  title: "Blog & Performance — SJ Consult",
  description:
    "Articles on JAMB guidelines, UNILAG undergraduate life, and what our data shows about aspirant performance.",
};

export default function BlogPage() {
  return <BlogList />;
}
