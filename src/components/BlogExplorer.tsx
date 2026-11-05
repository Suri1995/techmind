"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BlogCard } from "./cards";
import type { BlogPost } from "@/lib/data";
import { IconArrowRight } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

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
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="max-w-3xl"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease }} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">
          <span className="h-px w-10 bg-teal-deep" />
          The Tech.Mind journal
        </motion.div>
        <motion.h1 variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.65, ease }} className="mt-5 text-balance font-display text-5xl leading-[0.98] text-ink sm:text-7xl">
          Ideas worth <span className="text-gradient">keeping.</span>
        </motion.h1>
        <motion.p variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease }} className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
          Clear thinking on search, content and digital growth — made for the people making the next move.
        </motion.p>
      </motion.div>

      {isDefaultView && featured && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.25, ease }}>
          <Link href={`/blog/${featured.slug}`} className="group relative mt-14 grid overflow-hidden rounded-[30px] border border-line bg-ink shadow-[var(--shadow-lift)] md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[18rem] overflow-hidden md:min-h-[25rem]">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-ink/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-paper backdrop-blur-md">Featured read</span>
            </div>
            <div className="flex flex-col justify-between p-7 text-paper md:p-10">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-on-ink"><span>{featured.category}</span><span aria-hidden>·</span><span>{featured.readTime}</span></div>
                <h2 className="mt-5 font-display text-3xl leading-tight text-paper transition-colors group-hover:text-aqua md:text-4xl">{featured.title}</h2>
                <p className="mt-4 leading-relaxed text-slate-on-ink">{featured.excerpt}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-aqua">Read the article <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="mt-16 flex flex-col gap-5 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by topic">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={category === c} onClick={() => setCategory(c)} className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${category === c ? "border-ink bg-ink text-paper shadow-[var(--shadow-soft)]" : "border-transparent text-slate hover:border-line hover:text-ink"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input id="blog-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search journal" className="w-full rounded-full border border-line bg-paper-raised py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-teal-deep focus:ring-2 focus:ring-teal/20" />
        </div>
      </div>

      {isDefaultView && featured && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease }}
          className="mt-12 grid overflow-hidden rounded-[24px] border border-line bg-mist sm:grid-cols-3"
        >
          {[
            ["SEO", "Compounding visibility", "Earn attention over time."],
            ["Google Ads", "Immediate reach", "Capture demand today."],
            ["The answer", "A smarter mix", "Use both with intent."],
          ].map(([label, title, text], index) => (
            <div key={label} className={`group p-6 transition-colors hover:bg-paper-raised ${index < 2 ? "border-b border-line sm:border-b-0 sm:border-r" : ""}`}>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep"><span>{label}</span><span className="font-mono text-slate">0{index + 1}</span></div>
              <p className="mt-5 font-display text-xl text-ink transition-transform duration-300 group-hover:translate-x-1">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate">{text}</p>
            </div>
          ))}
        </motion.div>
      )}

      {(isDefaultView ? rest : filtered).length > 0 && (
        <>
          <div className="mb-7 mt-16 flex items-end justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Latest thinking</p><p className="mt-2 font-display text-2xl text-ink">One useful idea at a time.</p></div>
            <span className="hidden text-sm text-slate sm:block">{filtered.length} {filtered.length === 1 ? "article" : "articles"}</span>
          </div>
          <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {(isDefaultView ? rest : filtered).map((post) => (
                <motion.div key={post.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease }}><BlogCard post={post} /></motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center"><p className="font-display text-xl text-ink">No articles match &ldquo;{query}&rdquo;.</p><p className="mt-2 text-sm text-slate">Try a shorter search, or pick another topic.</p><button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-full border border-teal-deep px-5 py-2 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-deep hover:text-paper">Clear filters</button></div>
      )}
    </div>
  );
}
