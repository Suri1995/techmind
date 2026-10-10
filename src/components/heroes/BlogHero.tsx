"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { IconArrowRight } from "@/components/icons";
import { blogPosts } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
const deck = blogPosts.slice(0, 4);

/** Typographic hero with a swipeable stack of the latest articles. */
export default function BlogHero() {
  const [order, setOrder] = useState(deck.map((_, i) => i));

  const cycle = (dir: 1 | -1) =>
    setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) cycle(1);
  }

  const top = deck[order[0]];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#fbf6ec_0%,var(--paper)_55%)] pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-amber/20 blur-3xl" />
      <div className="wrap relative grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <HeroCrumbs crumbs={[{ href: "/blog", label: "Blog" }]} />
          <p className="text-sm font-medium text-teal-deep">The Tech.Mind journal</p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.04] text-ink sm:text-6xl md:text-[4.2rem]">
            <WordReveal text="Notes from" stagger={0.08} />
            <br />
            <WordReveal text="marketing, content" delay={0.2} stagger={0.08} />
            <br />
            <span className="relative inline-block">
              <WordReveal text="and growth." delay={0.4} stagger={0.08} />
              <motion.svg
                aria-hidden
                viewBox="0 0 300 14"
                className="absolute -bottom-1 left-0 h-3 w-full"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 9 C 60 2, 120 14, 180 7 S 270 4, 298 8"
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 1.1, ease }}
                />
              </motion.svg>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
            className="mt-7 max-w-md text-lg leading-relaxed text-slate"
          >
            What we&apos;re learning across our engagements — written for the people who have to make the calls, not just
            the people who read about them.
          </motion.p>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5]">
            {deck.map((post, i) => {
              const pos = order.indexOf(i);
              const isTop = pos === 0;
              return (
                <motion.article
                  key={post.slug}
                  drag={isTop ? "x" : false}
                  dragSnapToOrigin
                  dragElastic={0.6}
                  onDragEnd={onDragEnd}
                  animate={{
                    scale: 1 - pos * 0.05,
                    y: pos * 18,
                    rotate: pos === 0 ? 0 : pos % 2 ? 3 * pos : -3 * pos,
                    opacity: 1 - pos * 0.18,
                  }}
                  whileDrag={{ scale: 1.03, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  style={{ zIndex: deck.length - pos, touchAction: "pan-y" }}
                  className={`absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper-raised shadow-[var(--shadow-lift)] ${
                    isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                  }`}
                >
                  <div className="relative h-[55%]">
                    <Image src={post.image} alt="" fill draggable={false} sizes="24rem" className="select-none object-cover" priority={i === 0} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-slate">
                      <span className="rounded-full bg-teal-tint px-2.5 py-1 font-medium text-teal-deep">{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="mt-3 line-clamp-3 font-display text-xl leading-snug text-ink">{post.title}</h2>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <p className="text-sm text-slate" aria-live="polite">
              <span className="font-display text-ink">{String(deck.indexOf(top) + 1).padStart(2, "0")}</span> / {String(deck.length).padStart(2, "0")} · drag or use the arrows
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => cycle(-1)}
                aria-label="Previous article"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-teal-deep hover:text-teal-deep"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                onClick={() => cycle(1)}
                aria-label="Next article"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-teal-deep"
              >
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
