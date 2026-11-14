"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
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
// The wipe only ever animates the clip + a tiny scale; at rest the image sits at scale 1,
// so the full 2:1 artwork is always visible.
const imageVariants: Variants = {
  enter: (d: number) => ({
    clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    scale: 1.04,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: { duration: 0.95, ease: EASE },
  },
  exit: {
    scale: 0.98,
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

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1.2" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1.2" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 4.6a1 1 0 0 1 1.5-.86l8 5.4a1 1 0 0 1 0 1.72l-8 5.4a1 1 0 0 1-1.5-.86V4.6Z" />
    </svg>
  );
}

/** Counts up to a value whenever it changes (these are stats, not service numbering). */
function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: EASE });
    return () => controls.stop();
  }, [value, reduce, mv]);
  return <motion.span>{rounded}</motion.span>;
}

/* Light accent-tinted backdrop used behind artwork and thumbnails */
const tint = (accent: string) => `linear-gradient(135deg, ${accent}26, #eef8f5 70%)`;

export default function Services() {
  const reduce = useReducedMotion();
  const total = services.length;

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  // if an image file is missing we show a branded panel instead of an empty frame
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const markFailed = (slug: string) => setFailed((f) => (f[slug] ? f : { ...f, [slug]: true }));

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.25 });

  // autoplay progress (0 → 1) feeds the tab underline, the segment bar and the ring on the next button
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
    (next: number, forceDir?: number) => {
      const i = (next + total) % total;
      setDir(forceDir ?? (i >= active ? 1 : -1));
      progress.set(0);
      setActive(i);
    },
    [active, total, progress]
  );

  const paused = hoverPaused || userPaused;

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

  /* ───────── 3D tilt + glare for the image stage (the frame tilts, the artwork is never scaled up) ───────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
  const tiltX = useTransform(sy, (v) => v * -8);
  const tiltY = useTransform(sx, (v) => v * 10);
  const gx = useTransform(sx, (v) => (v + 0.5) * 100);
  const gy = useTransform(sy, (v) => (v + 0.5) * 100);
  const glareOn = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.45), transparent 45%)`;

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

  /* ───────── cursor spotlight across the whole showcase panel ───────── */
  const spx = useMotionValue(-400);
  const spy = useMotionValue(-400);
  const spot = useMotionTemplate`radial-gradient(420px circle at ${spx}px ${spy}px, rgba(20,184,166,0.12), transparent 70%)`;
  const onPanelMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    spx.set(e.clientX - r.left);
    spy.set(e.clientY - r.top);
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
      go(active + 1, 1);
      tabRefs.current[(active + 1) % total]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(active - 1, -1);
      tabRefs.current[(active - 1 + total) % total]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
      tabRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
      tabRefs.current[total - 1]?.focus();
    }
  };

  const current = services[active];
  const next = services[(active + 1) % total];
  const cv = getServiceVisual(current.slug);
  const nv = getServiceVisual(next.slug);
  const currentOk = !!cv.image && !failed[current.slug];
  const nextOk = !!nv.image && !failed[next.slug];
  const nameWords = current.name.split(" ");
  // long names would wrap awkwardly inside the pill button
  const ctaLabel = current.name.length > 22 ? "Explore this service" : `Explore ${current.name}`;

  const stats = [
    { label: "Channels", value: current.channels.length },
    { label: "Deliverables", value: current.included.length },
    { label: "Process steps", value: current.process.length },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        @keyframes svc-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        .svc-marquee-track { animation: svc-marquee var(--svc-dur, 28s) linear infinite; will-change: transform; }
      `}</style>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-gradient-to-b from-paper via-[#eef8f5] to-paper py-10 text-ink sm:py-16 md:py-20"
      >
        <div className="mesh-hero pointer-events-none opacity-60">
          <div className="mesh-grid" />
          <div className="mesh-blob one" />
          <div className="mesh-blob two" />
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
                className="btn-shine group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-amber sm:px-6 sm:py-3.5"
              >
                View all services
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div
              className="mt-8 sm:mt-10 md:mt-12"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPaused(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setHoverPaused(false)}
              onFocus={(e) => e.target.matches(":focus-visible") && setHoverPaused(true)}
              onBlur={() => setHoverPaused(false)}
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
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-8px_rgba(6,31,34,0.3)] transition-all duration-300 hover:scale-105 hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
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
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-8px_rgba(6,31,34,0.3)] transition-all duration-300 hover:scale-105 hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
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
                  className={`relative flex select-none gap-1.5 overflow-x-auto overscroll-x-contain rounded-[20px] border border-line bg-white/80 p-1.5 shadow-[0_1px_2px_rgba(6,31,34,0.04),0_14px_32px_-22px_rgba(6,31,34,0.25)] backdrop-blur-md [scrollbar-width:none] sm:gap-2 sm:rounded-[24px] sm:p-2 [&::-webkit-scrollbar]:hidden ${
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
                            className="absolute inset-0 rounded-2xl border border-teal-deep/30 bg-gradient-to-b from-white to-teal-tint shadow-[0_14px_30px_-14px_rgba(11,122,114,0.5)]"
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                          />
                        ) : (
                          <span className="absolute inset-0 rounded-2xl bg-teal-tint/0 transition-colors duration-300 group-hover:bg-teal-tint" />
                        )}

                        <span className="relative flex items-center gap-2.5 sm:gap-3">
                          {/* thumbnail keeps the artwork's 2:1 ratio so it is never cropped */}
                          <span
                            className={`relative aspect-[2/1] h-8 shrink-0 overflow-hidden rounded-lg ring-1 transition-all duration-300 sm:h-9 ${
                              isActive ? "ring-teal-deep/30" : "opacity-90 ring-black/5 group-hover:opacity-100"
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
                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </span>
                          <span
                            className={`whitespace-nowrap text-[13px] font-semibold leading-snug transition-colors duration-300 sm:text-sm ${
                              isActive ? "text-ink" : "text-ink-soft group-hover:text-ink"
                            }`}
                          >
                            {service.name}
                          </span>
                        </span>

                        {isActive && (
                          <span className="absolute inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full bg-teal-deep/15">
                            <motion.span
                              className="block h-full origin-left rounded-full bg-gradient-to-r from-teal-deep to-amber"
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
                ref={panelRef}
                id="service-panel"
                role="tabpanel"
                aria-labelledby={`service-tab-${current.slug}`}
                onPointerMove={onPanelMove}
                className="relative mt-3 overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-white via-[#f4faf8] to-[#e6f4f0] shadow-[0_1px_2px_rgba(6,31,34,0.04),0_40px_80px_-44px_rgba(11,122,114,0.45)] sm:mt-4 sm:rounded-[32px]"
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
                      style={{ background: `radial-gradient(circle, ${cv.accent}33, transparent 65%)` }}
                      animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 24, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-40 -left-24 h-[20rem] w-[20rem] rounded-full blur-3xl sm:h-[26rem] sm:w-[26rem]"
                      style={{ background: `radial-gradient(circle, ${cv.accent}1f, transparent 65%)` }}
                      animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -20, 0] }}
                      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* dot grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]"
                  style={{
                    backgroundImage: "radial-gradient(rgba(11,122,114,0.14) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* cursor spotlight */}
                <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: spot }} />

                <div className="relative grid items-center gap-7 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 lg:p-10">
                  {/* ── content (fixed min-height so the card never jumps between services) ── */}
                  <div className="relative order-2 flex min-h-[22rem] flex-col justify-center sm:min-h-[26rem] lg:order-1 lg:min-h-[28rem]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={current.slug}
                        variants={group}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="relative"
                      >
                        <motion.span
                          variants={item}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-2 pr-3 text-xs font-semibold text-ink-soft shadow-[0_6px_16px_-10px_rgba(6,31,34,0.35)]"
                        >
                          <span className="relative flex h-2 w-2">
                            <span
                              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden"
                              style={{ background: cv.accent }}
                            />
                            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: cv.accent }} />
                          </span>
                          {current.channels.length} channels covered
                        </motion.span>

                        <h3 className="mt-4 font-display text-[1.7rem] font-semibold leading-[1.1] text-ink sm:mt-5 sm:text-4xl lg:text-[2.2rem] xl:text-[2.7rem]">
                          {nameWords.map((w, i) => (
                            <span key={`${w}-${i}`} className="mr-[0.28em] inline-block overflow-hidden pb-1 align-bottom">
                              <motion.span variants={word} className="inline-block">
                                {w}
                              </motion.span>
                            </span>
                          ))}
                        </h3>

                        <motion.p variants={item} className="mt-3 text-[15px] font-medium leading-relaxed text-ink sm:mt-4 md:text-lg">
                          {current.tagline}
                        </motion.p>
                        <motion.p variants={item} className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-soft sm:mt-3">
                          {current.short}
                        </motion.p>

                        <motion.ul variants={item} className="mt-5 hidden space-y-2.5 sm:block">
                          {current.bestFor.slice(0, 2).map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                              <span
                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-inset"
                                style={{ background: `${cv.accent}26`, ["--tw-ring-color" as string]: `${cv.accent}66` }}
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
                              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep sm:px-6"
                            >
                              {ctaLabel}
                              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </motion.div>

                          {/* controls: previous, play/pause, next (with autoplay ring) */}
                          <div className="flex items-center gap-1 rounded-full border border-line bg-white/90 p-1 shadow-[0_8px_20px_-14px_rgba(6,31,34,0.4)] backdrop-blur-md">
                            <button
                              type="button"
                              onClick={() => go(active - 1, -1)}
                              aria-label="Previous service"
                              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                            >
                              <IconArrowRight className="h-4 w-4 rotate-180" />
                            </button>
                            {!reduce && (
                              <button
                                type="button"
                                onClick={() => setUserPaused((p) => !p)}
                                aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
                                aria-pressed={userPaused}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-teal-tint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                              >
                                {userPaused ? <PlayIcon className="h-3.5 w-3.5" /> : <PauseIcon className="h-3.5 w-3.5" />}
                              </button>
                            )}
                            <span className="relative h-11 w-11">
                              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
                                <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(6,31,34,0.12)" strokeWidth="2" />
                                <motion.circle
                                  cx="22"
                                  cy="22"
                                  r="20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  className="text-teal-deep"
                                  style={{ pathLength: reduce ? 0 : progress }}
                                />
                              </svg>
                              <button
                                type="button"
                                onClick={() => go(active + 1, 1)}
                                aria-label="Next service"
                                className="absolute inset-[3px] flex items-center justify-center rounded-full bg-teal text-ink transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
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
                      className="touch-pan-y pb-3 pr-3 sm:pb-5 sm:pr-5"
                      drag={reduce ? false : "x"}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.12}
                      dragSnapToOrigin
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -70) go(active + 1, 1);
                        else if (info.offset.x > 70) go(active - 1, -1);
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
                        {/* accent halo behind the frame */}
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={`halo-${current.slug}`}
                            aria-hidden
                            className="pointer-events-none absolute inset-3 rounded-[28px] blur-2xl"
                            style={{ background: cv.accent }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.22 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9 }}
                          />
                        </AnimatePresence>

                        {/* peek of the next service, stacked behind */}
                        <div className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-5 sm:translate-y-5">
                          <AnimatePresence initial={false}>
                            <motion.div
                              key={`peek-${next.slug}`}
                              className="absolute inset-0 overflow-hidden rounded-[16px] border border-line sm:rounded-[22px]"
                              style={{ background: tint(nv.accent) }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.7 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8 }}
                            >
                              {nextOk && (
                                <Image src={nv.image} alt="" fill sizes="40vw" unoptimized className="object-contain blur-[1.5px]" />
                              )}
                              <div className="absolute inset-0 bg-white/40" />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* main frame: locked to the artwork's 1774 × 887 (2:1) ratio and sized by width,
                            so the whole image shows on every screen. object-contain is a safety net. */}
                        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_36px_70px_-34px_rgba(11,122,114,0.55)] sm:rounded-[22px]">
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
                                <Image
                                  src={cv.image}
                                  alt={cv.alt}
                                  fill
                                  priority={active === 0}
                                  unoptimized
                                  sizes="(min-width: 1024px) 58vw, 100vw"
                                  onError={() => markFailed(current.slug)}
                                  className="object-contain"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                                  <span className="font-display text-2xl font-semibold text-ink sm:text-4xl">{current.name}</span>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>

                          {/* light sweep on every change */}
                          <motion.div
                            key={`sheen-${current.slug}`}
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
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

                          <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-ink/10 sm:rounded-[22px]" />
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* stats sit below the image, so nothing ever covers the artwork */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.dl
                        key={`stats-${current.slug}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="mr-3 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-white/85 shadow-[0_10px_24px_-18px_rgba(6,31,34,0.35)] backdrop-blur-md sm:mr-5"
                      >
                        {stats.map((s) => (
                          <div key={s.label} className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                            <dd className="font-display text-xl font-semibold leading-none text-ink tabular-nums sm:text-2xl">
                              <Counter value={s.value} />
                            </dd>
                            <dt className="mt-1 text-[11px] font-medium text-ink-soft sm:text-xs">{s.label}</dt>
                          </div>
                        ))}
                      </motion.dl>
                    </AnimatePresence>

                    {/* channel marquee: seamless CSS loop (two identical groups, shifted by exactly -50%), pauses on hover */}
                    <div
                      key={`marquee-${current.slug}`}
                      className="group/marquee relative mr-3 mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:mr-5 sm:mt-4"
                      aria-label={`Channels: ${current.channels.join(", ")}`}
                    >
                      <div
                        className="svc-marquee-track flex w-max motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
                        style={{ ["--svc-dur" as string]: `${Math.max(22, current.channels.length * 4)}s` }}
                      >
                        {[0, 1].map((copy) => (
                          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-2.5 pr-2.5">
                            {Array.from({ length: Math.max(1, Math.ceil(10 / current.channels.length)) }).flatMap((_, rep) =>
                              current.channels.map((c) => (
                                <span
                                  key={`${copy}-${rep}-${c}`}
                                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-[0_4px_10px_-8px_rgba(6,31,34,0.35)] sm:px-3.5"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: cv.accent }} />
                                  {c}
                                </span>
                              ))
                            )}
                          </div>
                        ))}
                      </div>
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