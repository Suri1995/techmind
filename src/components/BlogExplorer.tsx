import { BlogCard } from "./cards";
import type { BlogPost } from "@/lib/data";

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
    </div>
  );
}
