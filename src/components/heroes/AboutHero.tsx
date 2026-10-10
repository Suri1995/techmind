"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { IconArrowRight } from "@/components/icons";

const ease = [0.22, 1, 0.36, 1] as const;

const pillars = [
  {
    key: "Strategy",
    text: "We start with your audience, offer, market and budget, then choose the channels that suit them. Plans are tailored to your business goals, audience, and budget.",
    links: [
      { label: "SEO", href: "/services/seo" },
      { label: "Performance Marketing", href: "/services/performance-marketing" },
    ],
  },
  {
    key: "Creativity",
    text: "Content, video and design that earn attention for the right reasons, built to fit each platform and to support the goal behind it.",
    links: [
      { label: "Video & Graphics", href: "/services/video-editing" },
      { label: "Influencer Marketing", href: "/services/influencer-marketing" },
    ],
  },
  {
    key: "Performance",
    text: "Paid media, search and websites connected to tracking and lead follow-up, so you can see what is working and what to do next.",
    links: [
      { label: "Meta Ads", href: "/services/meta-ads" },
      { label: "Google Ads", href: "/services/google-ads" },
    ],
  },
];

/** Editorial hero: scrolling ghost word and a tabbed Strategy / Creativity / Performance explainer. */
export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const [active, setActive] = useState(0);
  const current = pillars[active];

  return (
    <section ref={ref} className="relative overflow-hidden bg-paper pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_10%,var(--teal-tint),transparent_70%)]" />
      <motion.span
        aria-hidden
        style={{ y: ghostY, WebkitTextStroke: "1.5px var(--line)" }}
        className="pointer-events-none absolute -left-4 top-6 select-none font-display text-[22vw] leading-none text-transparent md:text-[15rem]"
      >
        About
      </motion.span>

      <div className="wrap relative grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <HeroCrumbs crumbs={[{ href: "/about", label: "About" }]} />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-sm font-medium text-teal-deep"
          >
            About us · Hyderabad
          </motion.p>
          <h1 className="mt-4 max-w-2xl font-display text-[2.2rem] leading-[1.1] text-ink sm:text-5xl md:text-[3.3rem]">
            <WordReveal text="A digital marketing partner for brands that want to grow with purpose." stagger={0.04} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate"
          >
            We bring strategy, creativity and performance together in one team, so your brand is seen, remembered and chosen.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="hero-dark relative overflow-hidden rounded-[28px] p-7 text-paper shadow-[var(--shadow-lift)] md:p-9"
        >
          <div className="hero-beam" />
          <div className="relative">
            <div role="tablist" aria-label="Our approach" className="flex gap-2">
              {pillars.map((p, i) => (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                >
                  {active === i && (
                    <motion.span layoutId="about-tab" className="absolute inset-0 rounded-full bg-white/15" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  <span className={`relative ${active === i ? "text-paper" : "text-slate-on-ink"}`}>{p.key}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 min-h-[11rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <p className="font-display text-3xl">{current.key}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-on-ink">{current.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {current.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-aqua transition-colors hover:bg-aqua hover:text-ink">
                          {l.label}
                          <IconArrowRight className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
