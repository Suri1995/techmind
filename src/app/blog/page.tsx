import type { Metadata } from "next";
import BlogExplorer from "@/components/BlogExplorer";
import { blogPosts } from "@/lib/data";
import BlogHero from "@/components/heroes/BlogHero";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on digital marketing, SEO, paid media and growth from the Tech.Mind team.",
};

export default function BlogPage() {
  return (
    <section className="wrap py-16 md:py-24">
      <BlogHero/>
      <BlogExplorer posts={blogPosts} />
    </section>
  );
}