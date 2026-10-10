"use client";

import Image from "next/image";
import type { BlogPost } from "@/lib/data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card-lift group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-soft shadow-[var(--shadow-soft)]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-slate">
        <span className="rounded-full bg-teal-tint px-2.5 py-1 font-medium text-teal-deep">{post.category}</span>
        <span aria-hidden>·</span>
        <span>{post.date}</span>
        <span aria-hidden>·</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="mt-3 font-display text-xl text-ink transition-colors group-hover:text-teal-deep">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate">{post.excerpt}</p>
    </article>
  );
}
