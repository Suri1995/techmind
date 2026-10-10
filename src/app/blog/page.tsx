import type { Metadata } from "next";
import BlogHero from "@/components/heroes/BlogHero";
import BlogExplorer from "@/components/BlogExplorer";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on technology strategy, product design and engineering from the Tech.Mind team.",
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />

      <section className="wrap py-16 md:py-24">
        <BlogExplorer posts={blogPosts} />
      </section>
    </>
  );
}
