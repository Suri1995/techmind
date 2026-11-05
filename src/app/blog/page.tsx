import type { Metadata } from "next";
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
      <section className="wrap pb-20 pt-10 md:pb-28 md:pt-16">
        <BlogExplorer posts={blogPosts} />
      </section>
    </>
  );
}
