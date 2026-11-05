"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/icons";
import { services, getServiceVisual } from "@/lib/data";

const AUTO_MS = 6500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ───────── motion variants ───────── */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22 } },
};
const word: Variants = {
  hidden: { y: "115%", rotate: 5 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { y: "-110%", transition: { duration: 0.22 } },
};
const imageVariants: Variants = {
  enter: (d: number) => ({
    clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    scale: 1.1,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: { duration: 0.95, ease: EASE },
  },
  exit: {
    scale: 0.96,
    opacity: 0,
    transition: { duration: 0.95, ease: EASE, opacity: { delay: 0.55, duration: 0.4 } },
  },
};

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tint = (accent: string) => `linear-gradient(135deg, ${accent}, #071a1d)`;

export default function Services() {
  const reduce = useReducedMotion();
  const total = services.length;

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  // if an image file is missing we show a branded panel instead of an empty frame
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const markFailed = (slug: string) => setFailed((f) => (f[slug] ? f : { ...f, [slug]: true }));

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.25 });

  // autoplay progress (0 → 1) feeds the tab bar and the ring on the next button
  const progress = useMotionValue(0);

  /* ───────── rail: arrows, edge fades, drag-to-scroll ───────── */
  const [edge, setEdge] = useState({ left: false, right: true });
  const [grabbing, setGrabbing] = useState(false);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  const updateEdges = useCallback(() => {
    const r = railRef.current;
    if (!r) return;
    const left = r.scrollLeft > 4;
    const right = r.scrollLeft + r.clientWidth < r.scrollWidth - 4;
    setEdge((p) => (p.left === left && p.right === right ? p : { left, right }));
  }, []);

  useEffect(() => {
    const r = railRef.current;
    if (!r) return;
    updateEdges();
    r.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(r);
    return () => {
      r.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const nudge = (d: number) => {
    const r = railRef.current;
    if (!r) return;
    r.scrollBy({ left: d * r.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
  };

  const onRailDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !railRef.current) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: railRef.current.scrollLeft };
  };
  const onRailMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || !railRef.current) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setGrabbing(true);
    }
    if (d.moved) railRef.current.scrollLeft = d.startLeft - dx;
  };
  const onRailUp = () => {
    drag.current.down = false;
    setGrabbing(false);
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  };

  /* ───────── navigation + autoplay ───────── */
  const go = useCallback(
    (next: number) => {
      const i = (next + total) % total;
      setDir(i >= active ? 1 : -1);
      progress.set(0);
      setActive(i);
    },
    [active, total, progress]
  );

  useEffect(() => {
    if (paused || !inView || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = progress.get() + (now - last) / AUTO_MS;
      last = now;
      if (next >= 1) {
        progress.set(0);
        setDir(1);
        setActive((a) => (a + 1) % total);
      } else {
        progress.set(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, inView, reduce, total, progress]);

  // keep the active tab centred in the rail without scrolling the page
  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab) return;
    rail.scrollTo({
      left: tab.offsetLeft - (rail.clientWidth - tab.clientWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

  // warm the browser cache so every wipe transition is instant
  useEffect(() => {
    services.forEach((s) => {
      const src = getServiceVisual(s.slug).image;
      if (!src) return;
      const im = new window.Image();
      im.onerror = () => markFailed(s.slug);
      im.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── 3D tilt, parallax and glare for the image stage ───────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
  const tiltX = useTransform(sy, (v) => v * -9);
  const tiltY = useTransform(sx, (v) => v * 11);
  const imgX = useTransform(sx, (v) => v * -16);
  const imgY = useTransform(sy, (v) => v * -12);
  const gx = useTransform(sx, (v) => (v + 0.5) * 100);
  const gy = useTransform(sy, (v) => (v + 0.5) * 100);
  const glareOn = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 45%)`;

  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    glareOn.set(1);
  };
  const onStageLeave = () => {
    mx.set(0);
    my.set(0);
    glareOn.set(0);
  };

  /* magnetic CTA (mouse only) */
  const bx = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const by = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const onCtaMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    bx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    by.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onCtaLeave = () => {
    bx.set(0);
    by.set(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(active + 1);
      tabRefs.current[(active + 1) % total]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(active - 1);
      tabRefs.current[(active - 1 + total) % total]?.focus();
    }
  };

  const current = services[active];
  const next = services[(active + 1) % total];
  const cv = getServiceVisual(current.slug);
  const nv = getServiceVisual(next.slug);
  const currentOk = !!cv.image && !failed[current.slug];
  const nextOk = !!nv.image && !failed[next.slug];
  const pad = (n: number) => String(n).padStart(2, "0");
  const nameWords = current.name.split(" ");
  // long names would wrap awkwardly inside the pill button
  const ctaLabel = current.name.length > 22 ? "Explore this service" : `Explore ${current.name}`;

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} className="relative overflow-hidden py-12 sm:py-16 md:py-24">
        <div className="mesh-hero pointer-events-none opacity-60">
          <div className="mesh-blob one" />
        </div>

        <div className="wrap relative">
          {/* Heading */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title="Complete Digital Marketing Solutions Under One Roof"
                description="Choose the support you need. Share a few project details and our team can follow up with the right next steps."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/services"
                className="btn-shine group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep sm:px-6 sm:py-3.5"
              >
                View all services
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div
              className="mt-8 sm:mt-10 md:mt-12"
              onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {/* ───────── TOP: service selector rail ───────── */}
              <div className="relative">
                <AnimatePresence>
                  {edge.left && (
                    <motion.div
                      key="fade-l"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 items-center justify-start rounded-l-[22px] bg-gradient-to-r from-paper via-paper/80 to-transparent pl-2.5 sm:flex"
                    >
                      <button
                        type="button"
                        onClick={() => nudge(-1)}
                        aria-label="Scroll services left"
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                      >
                        <IconArrowRight className="h-4 w-4 rotate-180" />
                      </button>
                    </motion.div>
                  )}
                  {edge.right && (
                    <motion.div
                      key="fade-r"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 items-center justify-end rounded-r-[22px] bg-gradient-to-l from-paper via-paper/80 to-transparent pr-2.5 sm:flex"
                    >
                      <button
                        type="button"
                        onClick={() => nudge(1)}
                        aria-label="Scroll services right"
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                      >
                        <IconArrowRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  ref={railRef}
                  role="tablist"
                  aria-label="Services"
                  onKeyDown={onKeyDown}
                  onPointerDown={onRailDown}
                  onPointerMove={onRailMove}
                  onPointerUp={onRailUp}
                  onPointerLeave={onRailUp}
                  onPointerCancel={onRailUp}
                  className={`relative flex select-none gap-1.5 overflow-x-auto overscroll-x-contain rounded-[20px] border border-line bg-white/70 p-1.5 backdrop-blur-md [scrollbar-width:none] sm:gap-2 sm:rounded-[24px] sm:p-2 [&::-webkit-scrollbar]:hidden ${
                    grabbing ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {services.map((service, i) => {
                    const isActive = i === active;
                    const v = getServiceVisual(service.slug);
                    const ok = !!v.image && !failed[service.slug];
                    return (
                      <button
                        key={service.slug}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`service-tab-${service.slug}`}
                        aria-selected={isActive}
                        aria-controls="service-panel"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          if (drag.current.moved) return;
                          go(i);
                        }}
                        className="group relative shrink-0 overflow-hidden rounded-2xl p-1.5 pr-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal sm:p-2 sm:pr-5"
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="service-active-pill"
                            className="absolute inset-0 rounded-2xl bg-ink shadow-[0_14px_32px_-12px_rgba(0,0,0,0.55)]"
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                          />
                        ) : (
                          <span className="absolute inset-0 rounded-2xl bg-teal-tint/0 transition-colors duration-300 group-hover:bg-teal-tint" />
                        )}

                        <span className="relative flex items-center gap-2.5 sm:gap-3">
                          <span
                            className={`relative h-9 w-14 shrink-0 overflow-hidden rounded-xl ring-1 transition-all duration-300 sm:h-10 sm:w-[4.5rem] ${
                              isActive ? "ring-white/30" : "opacity-85 ring-black/5 group-hover:opacity-100"
                            }`}
                            style={{ background: tint(v.accent) }}
                          >
                            {ok && (
                              <Image
                                src={v.image}
                                alt=""
                                fill
                                sizes="72px"
                                unoptimized
                                onError={() => markFailed(service.slug)}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            )}
                            <span
                              className={`absolute left-1 top-1 rounded-md px-1 text-[10px] font-bold leading-4 tabular-nums backdrop-blur ${
                                isActive ? "bg-teal text-ink" : "bg-ink/70 text-paper"
                              }`}
                            >
                              {service.number}
                            </span>
                          </span>
                          <span
                            className={`whitespace-nowrap text-[13px] font-semibold leading-snug transition-colors duration-300 sm:text-sm ${
                              isActive ? "text-paper" : "text-slate group-hover:text-ink"
                            }`}
                          >
                            {service.name}
                          </span>
                        </span>

                        {isActive && (
                          <span className="absolute inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/15">
                            <motion.span
                              className="block h-full origin-left rounded-full bg-amber"
                              style={{ scaleX: reduce ? 1 : progress }}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ───────── BOTTOM: showcase ───────── */}
              <div
                id="service-panel"
                role="tabpanel"
                aria-labelledby={`service-tab-${current.slug}`}
                className="relative mt-3 overflow-hidden rounded-[24px] bg-ink shadow-[var(--shadow-lift)] sm:mt-4 sm:rounded-[32px]"
              >
                {/* ambient accent glow that cross-fades per service */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`glow-${current.slug}`}
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <motion.div
                      className="absolute -right-32 -top-32 h-[24rem] w-[24rem] rounded-full blur-3xl sm:h-[34rem] sm:w-[34rem]"
                      style={{ background: `radial-gradient(circle, ${cv.accent}66, transparent 65%)` }}
                      animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 24, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-40 -left-24 h-[20rem] w-[20rem] rounded-full blur-3xl sm:h-[26rem] sm:w-[26rem]"
                      style={{ background: `radial-gradient(circle, ${cv.accent}33, transparent 65%)` }}
                      animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -20, 0] }}
                      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* dot grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                <div className="relative grid items-center gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 lg:p-10">
                  {/* ── content (fixed min-height so the card never jumps between services) ── */}
                  <div className="relative order-2 flex min-h-[22rem] flex-col justify-center sm:min-h-[26rem] lg:order-1 lg:min-h-[27rem]">
                    {/* ghost number, kept to the right so it never sits under the heading */}
                    {/* <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`ghost-${current.slug}`}
                        aria-hidden
                        className="pointer-events-none absolute -top-2 right-0 hidden select-none font-display text-[7rem] font-bold leading-none text-white/[0.05] sm:block lg:text-[9rem]"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      >
                        {current.number}
                      </motion.span>
                    </AnimatePresence> */}

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={current.slug}
                        variants={group}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="relative"
                      >
                        {/* <motion.span
                          variants={item}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-70 motion-reduce:hidden" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                          </span>
                          Service {current.number}
                        </motion.span> */}

                        <h3 className="mt-4 font-display text-[1.7rem] leading-[1.1] text-paper sm:mt-5 sm:text-4xl lg:text-[2.2rem] xl:text-[2.7rem]">
                          {nameWords.map((w, i) => (
                            <span key={`${w}-${i}`} className="mr-[0.28em] inline-block overflow-hidden pb-1 align-bottom">
                              <motion.span variants={word} className="inline-block">
                                {w}
                              </motion.span>
                            </span>
                          ))}
                        </h3>

                        <motion.p variants={item} className="mt-3 text-[15px] leading-relaxed text-paper/90 sm:mt-4 md:text-lg">
                          {current.tagline}
                        </motion.p>
                        <motion.p variants={item} className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-on-ink sm:mt-3">
                          {current.short}
                        </motion.p>

                        <motion.ul variants={item} className="mt-5 hidden space-y-2.5 sm:block">
                          {current.bestFor.slice(0, 2).map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-paper/80">
                              <span
                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink"
                                style={{ background: cv.accent }}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </span>
                              {b}
                            </li>
                          ))}
                        </motion.ul>

                        <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
                          <motion.div onPointerMove={onCtaMove} onPointerLeave={onCtaLeave} style={{ x: bx, y: by }}>
                            <Link
                              href={`/services/${current.slug}`}
                              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber sm:px-6"
                            >
                              {ctaLabel}
                              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </motion.div>

                          {/* controls */}
                          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md sm:gap-2.5">
                            <button
                              type="button"
                              onClick={() => go(active - 1)}
                              aria-label="Previous service"
                              className="flex h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                            >
                              <IconArrowRight className="h-4 w-4 rotate-180" />
                            </button>
                            <span className="min-w-[3rem] text-center text-xs font-semibold tabular-nums text-paper">
                              {pad(active + 1)}
                              <span className="mx-1 text-paper/40">/</span>
                              {pad(total)}
                            </span>
                            <span className="relative h-11 w-11">
                              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
                                <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                                <motion.circle
                                  cx="22"
                                  cy="22"
                                  r="20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  className="text-amber"
                                  style={{ pathLength: reduce ? 0 : progress }}
                                />
                              </svg>
                              <button
                                type="button"
                                onClick={() => go(active + 1)}
                                aria-label="Next service"
                                className="absolute inset-[3px] flex items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                              >
                                <IconArrowRight className="h-4 w-4" />
                              </button>
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* ── image stage ── */}
                  <div className="order-1 min-w-0 lg:order-2">
                    <motion.div
                      className="touch-pan-y pb-3 pr-3 pt-3 sm:pb-5 sm:pr-5"
                      drag={reduce ? false : "x"}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.12}
                      dragSnapToOrigin
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -70) go(active + 1);
                        else if (info.offset.x > 70) go(active - 1);
                      }}
                    >
                      <motion.div
                        onPointerMove={onStageMove}
                        onPointerLeave={onStageLeave}
                        style={{
                          rotateX: reduce ? 0 : tiltX,
                          rotateY: reduce ? 0 : tiltY,
                          transformPerspective: 1200,
                          transformStyle: "preserve-3d",
                        }}
                        className="relative"
                      >
                        {/* peek of the next service, stacked behind */}
                        <div className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-5 sm:translate-y-5">
                          <AnimatePresence initial={false}>
                            <motion.div
                              key={`peek-${next.slug}`}
                              className="absolute inset-0 overflow-hidden rounded-[16px] border border-white/10 sm:rounded-[22px]"
                              style={{ background: tint(nv.accent) }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.4 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8 }}
                            >
                              {nextOk && (
                                <Image src={nv.image} alt="" fill sizes="40vw" unoptimized className="object-cover blur-[1.5px]" />
                              )}
                              <div className="absolute inset-0 bg-ink/40" />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* main frame: always 2:1 so the artwork is never cropped */}
                        <div className="relative aspect-[2/1] overflow-hidden rounded-[16px] border border-white/20 bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:rounded-[22px]">
                          <AnimatePresence initial={false} custom={dir} mode="sync">
                            <motion.div
                              key={current.slug}
                              custom={dir}
                              variants={imageVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="absolute inset-0"
                              style={{ background: tint(cv.accent) }}
                            >
                              {currentOk ? (
                                <motion.div className="absolute -inset-3 sm:-inset-4" style={{ x: imgX, y: imgY }}>
                                  <Image
                                    src={cv.image}
                                    alt={cv.alt}
                                    fill
                                    priority={active === 0}
                                    unoptimized
                                    sizes="(min-width: 1024px) 58vw, 100vw"
                                    onError={() => markFailed(current.slug)}
                                    className="object-cover"
                                  />
                                </motion.div>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
                                  <span className="font-display text-4xl text-white/80 sm:text-6xl">{current.number}</span>
                                  <span className="text-sm font-semibold text-paper sm:text-lg">{current.name}</span>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>

                          {/* light sweep on every change */}
                          <motion.div
                            key={`sheen-${current.slug}`}
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: "-120%" }}
                            animate={{ x: "420%" }}
                            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                          />

                          {/* pointer glare */}
                          <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                            style={{ background: glare, opacity: glareOn }}
                          />

                          <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-white/10 sm:rounded-[22px]" />
                        </div>

                        {/* floating chips (lifted in 3D) */}
                        <motion.div
                          key={`chip-a-${current.slug}`}
                          className="absolute -top-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-paper shadow-lg backdrop-blur-xl sm:left-4 sm:px-3 sm:py-1.5 sm:text-xs"
                          style={{ z: 60 }}
                          initial={{ opacity: 0, y: 14, scale: 0.9 }}
                          animate={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -5, 0], scale: 1 }}
                          transition={{
                            opacity: { duration: 0.5, delay: 0.5 },
                            scale: { duration: 0.5, delay: 0.5, ease: EASE },
                            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                          }}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ background: cv.accent }} />
                          {current.channels.length} channels
                        </motion.div>

                        <motion.div
                          key={`chip-b-${current.slug}`}
                          className="absolute -bottom-3 left-8 z-10 hidden rounded-full border border-white/25 bg-paper/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lg backdrop-blur-xl sm:block"
                          style={{ z: 40 }}
                          initial={{ opacity: 0, y: -14, scale: 0.9 }}
                          animate={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, 5, 0], scale: 1 }}
                          transition={{
                            opacity: { duration: 0.5, delay: 0.7 },
                            scale: { duration: 0.5, delay: 0.7, ease: EASE },
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
                          }}
                        >
                          {current.included.length} deliverables, {current.process.length}-step process
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* channel marquee */}
                    <div className="relative mt-2 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] sm:mt-3">
                      <motion.div
                        key={`marquee-${current.slug}`}
                        className="flex w-max"
                        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
                        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
                      >
                        {[...current.channels, ...current.channels].map((c, i) => (
                          <span
                            key={`${c}-${i}`}
                            className="mr-2.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-paper/80 sm:px-3.5"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: cv.accent }} />
                            {c}
                          </span>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </MotionConfig>
  );
}