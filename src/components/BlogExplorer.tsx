"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BlogCard } from "./cards";
import type { BlogPost } from "@/lib/data";
import { IconArrowRight } from "./icons";

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q)),
    );
  }, [posts, category, query]);

  const isDefaultView = category === "All" && !query.trim();
  const [featured, ...rest] = filtered;

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by topic">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                category === c
                  ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                  : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="w-full rounded-full border border-line bg-paper-raised py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-teal-deep focus:ring-2 focus:ring-teal/20"
          />
        </div>
      </div>

      {isDefaultView && featured && (
        <article className="group relative mt-10 grid overflow-hidden rounded-[28px] border border-line bg-paper-raised shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] md:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10">
            <div className="flex items-center gap-3 text-xs text-slate">
              <span className="rounded-full bg-teal-tint px-2.5 py-1 font-medium text-teal-deep">Featured</span>
              <span>{featured.category}</span>
              <span aria-hidden>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl leading-tight text-ink transition-colors group-hover:text-teal-deep md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 leading-relaxed text-slate">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
              Read the article
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      )}

      <motion.div layout className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {(isDefaultView ? rest : filtered).map((post) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-xl text-ink">No articles match &ldquo;{query}&rdquo;.</p>
          <p className="mt-2 text-sm text-slate">Try a shorter search, or pick another topic.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 rounded-full border border-teal-deep px-5 py-2 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-deep hover:text-paper"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
