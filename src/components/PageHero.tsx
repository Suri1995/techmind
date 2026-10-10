"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";

type Crumb = { href: string; label: string };
type Chip = { value?: string; label: string };

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  chips?: Chip[];
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function PageHero({ eyebrow, title, description, crumbs, chips }: Props) {
  return (
    <section className="hero-dark relative overflow-hidden rounded-b-[2.25rem] pb-20 pt-14 text-paper md:rounded-b-[4rem] md:pb-28 md:pt-20">
      {/* Atmosphere */}
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />

      <div className="wrap relative grid gap-12 md:grid-cols-[1.35fr_0.65fr] md:items-center">
        <div>
          {crumbs && crumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              aria-label="Breadcrumb"
              className="glass-dark mb-6 inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-1.5 text-xs text-slate-on-ink"
            >
              <Link href="/" className="transition-colors hover:text-aqua">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center gap-2">
                  <span aria-hidden className="text-line-dark">/</span>
                  <Link href={c.href} aria-current="page" className="text-paper transition-colors hover:text-aqua">
                    {c.label}
                  </Link>
                </span>
              ))}
            </motion.nav>
          )}

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
            className="flex items-center gap-2.5 text-sm font-medium text-aqua"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            {eyebrow}
          </motion.p>

          <h1 className="mt-5 max-w-3xl font-display text-[2.4rem] leading-[1.08] text-paper sm:text-5xl md:text-[3.5rem]">
            <WordReveal text={title} delay={0.1} stagger={0.05} />
          </h1>

          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
            className="mt-7 block h-[3px] w-24 origin-left rounded-full"
            style={{ background: "var(--grad-accent-light)" }}
          />

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: easeOut }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-on-ink"
            >
              {description}
            </motion.p>
          )}

          {chips && chips.length > 0 && (
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { delayChildren: 0.8, staggerChildren: 0.09 } } }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {chips.map((chip) => (
                <motion.li
                  key={chip.label}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
                  }}
                  className="glass-dark flex items-baseline gap-2 rounded-2xl px-4 py-2.5"
                >
                  {chip.value && <span className="font-display text-xl text-paper">{chip.value}</span>}
                  <span className="text-sm text-slate-on-ink">{chip.label}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: easeOut }}
          className="relative mx-auto hidden aspect-square w-full max-w-[22rem] md:block"
        >
          <OrbitVisual />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="absolute bottom-6 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-white/15 md:block">
        <span className="scroll-cue-bar block h-full w-full bg-aqua" />
      </div>
    </section>
  );
}

/** Concentric rings with satellites, drawn in the brand's teal and amber. */
function OrbitVisual() {
  return (
    <>
      <div className="absolute inset-[18%] rounded-full bg-teal/25 blur-3xl" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="core" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#67e8d6" />
            <stop offset="55%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0b7a72" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx="200" cy="200" r="92" fill="none" stroke="rgba(103,232,214,0.3)" />

        <g className="orbit-spin" style={{ ["--orbit-speed" as string]: "34s" }}>
          <circle cx="200" cy="10" r="6" fill="#67e8d6" />
          <circle cx="200" cy="10" r="14" fill="#67e8d6" opacity="0.18" />
        </g>
        <g className="orbit-spin reverse" style={{ ["--orbit-speed" as string]: "26s" }}>
          <circle cx="340" cy="200" r="5" fill="#e8a23a" />
          <circle cx="340" cy="200" r="12" fill="#e8a23a" opacity="0.2" />
        </g>
        <g className="orbit-spin" style={{ ["--orbit-speed" as string]: "18s" }}>
          <circle cx="200" cy="108" r="4" fill="#ffffff" opacity="0.9" />
        </g>

        <circle cx="200" cy="200" r="52" fill="url(#core)" />
        <circle cx="200" cy="200" r="52" fill="none" stroke="rgba(255,255,255,0.35)" />
        <path
          d="M178 204l16 14 30-36"
          fill="none"
          stroke="#031416"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
    </>
  );
}
