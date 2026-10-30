"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ServiceArt from "@/components/ServiceArt";
import { IconArrowRight } from "@/components/icons";
import { services } from "@/lib/data";

const AUTO_MS = 6000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Services() {
  const reduce = useReducedMotion();
  const total = services.length;

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.25 });

  // autoplay progress (0 → 1) drives the bar inside the active tab, no re-renders
  const progress = useMotionValue(0);

  // rail scroll state: arrows + edge fades + mouse drag-to-scroll
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
    // let the click handler see `moved`, then reset
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  };

  const go = useCallback(
    (next: number) => {
      const i = (next + total) % total;
      setDir(i >= active ? 1 : -1);
      progress.set(0);
      setActive(i);
    },
    [active, total, progress]
  );

  // autoplay loop – pauses on hover/focus, when off-screen, or if user prefers reduced motion
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

  // keep the active tab centred inside the horizontal rail (without scrolling the page)
  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab) return;
    rail.scrollTo({
      left: tab.offsetLeft - (rail.clientWidth - tab.clientWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

  // mouse parallax for the artwork
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });
  const artX = useTransform(sx, (v) => v * -18);
  const artY = useTransform(sy, (v) => v * -14);
  const ghostX = useTransform(sx, (v) => v * 26);
  const ghostY = useTransform(sy, (v) => v * 20);

  const onPreviewMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPreviewLeave = () => {
    mx.set(0);
    my.set(0);
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
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 md:py-24">
      <div className="mesh-hero pointer-events-none opacity-60">
        <div className="mesh-blob one" />
      </div>

      <div className="wrap relative">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
              className="btn-shine group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep"
            >
              View all services
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="mt-10 md:mt-12"
            onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* ───────── TOP: service selector rail ───────── */}
            <div className="relative">
              {/* edge fades + arrow buttons, shown only when there is more to scroll */}
              <AnimatePresence>
                {edge.left && (
                  <motion.div
                    key="fade-l"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-20 items-center justify-start rounded-l-[22px] bg-gradient-to-r from-paper via-paper/80 to-transparent pl-2.5"
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
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-end rounded-r-[22px] bg-gradient-to-l from-paper via-paper/80 to-transparent pr-2.5"
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
                className={`relative flex select-none gap-2.5 overflow-x-auto rounded-[22px] border border-line bg-white/60 p-2 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                  grabbing ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {services.map((service, i) => {
                  const isActive = i === active;
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
                      className="group relative shrink-0 overflow-hidden rounded-2xl py-3 pl-3.5 pr-5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal"
                    >
                      {/* sliding active background */}
                      {isActive && (
                        <motion.span
                          layoutId="service-active-pill"
                          className="absolute inset-0 rounded-2xl bg-ink shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      {!isActive && (
                        <span className="absolute inset-0 rounded-2xl bg-teal-tint/0 transition-colors duration-300 group-hover:bg-teal-tint" />
                      )}

                      <span className="relative flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                            isActive
                              ? "bg-teal text-ink"
                              : "bg-teal-tint text-teal-deep group-hover:bg-white"
                          }`}
                        >
                          {service.number}
                        </span>
                        <span
                          className={`whitespace-nowrap text-[13px] font-semibold leading-snug transition-colors duration-300 sm:text-sm ${
                            isActive ? "text-paper" : "text-slate group-hover:text-ink"
                          }`}
                        >
                          {service.name}
                        </span>
                      </span>

                      {/* autoplay progress */}
                      {isActive && (
                        <span className="absolute inset-x-3 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-white/15">
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

            {/* ───────── BOTTOM: cinematic preview ───────── */}
            <motion.div
              id="service-panel"
              role="tabpanel"
              aria-labelledby={`service-tab-${current.slug}`}
              onPointerMove={onPreviewMove}
              onPointerLeave={onPreviewLeave}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(active + 1);
                else if (info.offset.x > 70) go(active - 1);
              }}
              className="relative mt-4 h-[26rem] touch-pan-y overflow-hidden rounded-[28px] bg-ink shadow-[var(--shadow-lift)] sm:h-[28rem] lg:h-[33rem]"
            >
              {/* artwork with parallax + slow ken-burns */}
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={current.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <motion.div className="absolute -inset-6" style={{ x: artX, y: artY }}>
                    <ServiceArt slug={current.slug} className="h-full w-full" label={current.name} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* readability gradients */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink/70 via-transparent to-transparent lg:block" />


              {/* content */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={current.slug}
                    custom={dir}
                    initial={{ opacity: 0, x: 36 * dir }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 * dir }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="max-w-xl"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-70 motion-reduce:hidden" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                      </span>
                      Service {current.number}
                    </span>

                    <h3 className="mt-4 font-display text-3xl leading-tight text-paper md:text-4xl lg:text-5xl">
                      {current.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-on-ink md:text-base">{current.tagline}</p>
                    {current.short && (
                      <p className="mt-2 hidden max-w-lg text-sm leading-relaxed text-slate-on-ink/80 sm:block">
                        {current.short}
                      </p>
                    )}

                    <Link
                      href={`/services/${current.slug}`}
                      className="btn-shine group mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                    >
                      Explore {current.name}
                      <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* controls */}
                <div className="flex shrink-0 items-center gap-3 self-start rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur-md lg:self-end">
                  <button
                    type="button"
                    onClick={() => go(active - 1)}
                    aria-label="Previous service"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    <IconArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                  <span className="min-w-[3.5rem] text-center text-xs font-semibold tabular-nums text-paper">
                    {pad(active + 1)}
                    <span className="mx-1 text-paper/40">/</span>
                    {pad(total)}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(active + 1)}
                    aria-label="Next service"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}