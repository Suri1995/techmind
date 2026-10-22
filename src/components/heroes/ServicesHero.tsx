"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import Magnetic from "@/components/motion/Magnetic";
import { IconArrowRight } from "@/components/icons";
import HeroCrumbs from "./HeroCrumbs";
import { services } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  Data + geometry                                                            */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;
const items = services.slice(0, 8);
const COUNT = items.length;
const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const DWELL = 4800; // ms each service stays in focus during the auto tour
const R = 26; // orbit radius, % of the field (keeps every label inside the card)

type Side = "left" | "right" | "top" | "bottom";

// Services sit evenly on a true circle (no more overlapping or clipped chips).
// `side` decides where the label goes so labels always point away from the hub.
const spots = items.map((_, i) => {
  const a = ((-90 + (360 / COUNT) * i) * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const side: Side = cos > 0.35 ? "right" : cos < -0.35 ? "left" : sin < 0 ? "top" : "bottom";
  return { x: +(50 + R * cos).toFixed(2), y: +(50 + R * sin).toFixed(2), side };
});

/* Idle motion runs on CSS (compositor thread) and pauses when off-screen. */
const css = `
@keyframes svc-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,var(--fy,5px),0)}}
@keyframes svc-pulse{0%{transform:scale(.92);opacity:.55}100%{transform:scale(2.1);opacity:0}}
@keyframes svc-orbit{to{transform:rotate(360deg)}}
@keyframes svc-flow{to{stroke-dashoffset:-24}}
@keyframes svc-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes svc-ring{from{stroke-dashoffset:126}to{stroke-dashoffset:0}}
.svc-float{animation:svc-float var(--fd,5s) ease-in-out var(--fl,0s) infinite;will-change:transform}
.svc-pulse{animation:svc-pulse 3.6s cubic-bezier(.22,1,.36,1) infinite}
.svc-orbit{animation:svc-orbit 40s linear infinite}
.svc-orbit-rev{animation:svc-orbit 64s linear infinite reverse}
.svc-flow{animation:svc-flow 1s linear infinite}
.svc-fill{transform-origin:left center;animation:svc-fill ${DWELL}ms linear forwards}
.svc-ring{stroke-dasharray:126;animation:svc-ring ${DWELL}ms linear forwards}
[data-live="false"] .svc-float,[data-live="false"] .svc-pulse,[data-live="false"] .svc-orbit,
[data-live="false"] .svc-orbit-rev,[data-live="false"] .svc-flow{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){
  .svc-float,.svc-pulse,.svc-orbit,.svc-orbit-rev,.svc-flow{animation:none}
}
`;

/* -------------------------------------------------------------------------- */
/*  Auto tour: cycles services, pauses on hover / focus / user pause           */
/* -------------------------------------------------------------------------- */

function useTour(live: boolean, reduce: boolean) {
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const running = live && !hold && !userPaused && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % COUNT), DWELL);
    return () => window.clearTimeout(id);
  }, [running, active]);

  return { active, setActive, setHold, userPaused, setUserPaused, running };
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

/** Dark hero with a live service orbit: it tours the services on its own, hover or focus takes over, click opens. */
export default function ServicesHero() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const live = useInView(sectionRef, { margin: "0px" });
  const tour = useTour(live, reduce);

  const heading = `${WORDS[COUNT] ?? COUNT} services.`;

  return (
    <section ref={sectionRef} className="hero-dark relative overflow-hidden pb-16 pt-12 text-paper md:pb-24 md:pt-16">
      <style>{css}</style>

      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div
        className="wrap relative grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-5"
        onPointerEnter={(e) => e.pointerType === "mouse" && tour.setHold(true)}
        onPointerLeave={() => tour.setHold(false)}
      >
        {/* ------------------------------ copy ------------------------------ */}
        <div>
          <HeroCrumbs tone="dark" crumbs={[{ href: "/services", label: "Services" }]} />

          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.08] sm:text-5xl md:text-[3.4rem]">
            <WordReveal text={heading} stagger={0.07} />
            <br />
            <WordReveal text="One connected team." delay={0.3} stagger={0.07} gradient />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-on-ink"
          >
            Complete digital marketing solutions under one roof, from paid media, search and creative to websites and web applications.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                href="/contact"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-aqua px-7 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-lift)] transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
              >
                Discuss Your Project
                <IconArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-paper transition-colors hover:border-aqua hover:text-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
            >
              Explore Our Work
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <Detail
            active={tour.active}
            running={tour.running}
            userPaused={tour.userPaused}
            onPick={tour.setActive}
            onToggle={() => tour.setUserPaused((p) => !p)}
            reduce={reduce}
          />
        </div>

        {/* ---------------------- orbit (desktop) / grid (mobile) ---------------------- */}
        <div>
          <MobileGrid reduce={reduce} />
          <Orbit
            active={tour.active}
            running={tour.running}
            live={live}
            reduce={reduce}
            onPick={tour.setActive}
            setHold={tour.setHold}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Detail card (desktop): story-style progress, play / pause, open link       */
/* -------------------------------------------------------------------------- */

const Detail = memo(function Detail({
  active,
  running,
  userPaused,
  onPick,
  onToggle,
  reduce,
}: {
  active: number;
  running: boolean;
  userPaused: boolean;
  onPick: (i: number) => void;
  onToggle: () => void;
  reduce: boolean;
}) {
  const s = items[active];

  return (
    <div className="glass-dark relative mt-9 hidden max-w-md overflow-hidden rounded-2xl p-5 pb-4 lg:block">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent" />

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onToggle}
          aria-label={userPaused ? "Resume service tour" : "Pause service tour"}
          className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-aqua hover:text-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
        >
          {userPaused ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
              <path d="M3 1.8v8.4L10 6z" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
              <rect x="2.5" y="2" width="2.6" height="8" rx="0.8" />
              <rect x="6.9" y="2" width="2.6" height="8" rx="0.8" />
            </svg>
          )}
        </button>
      </div>

      <div className="relative mt-3 min-h-[8.5rem]" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.slug}
            initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease }}
          >
            <p className="font-display text-2xl text-paper">{s.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-on-ink">{s.short}</p>
            <Link
              href={`/services/${s.slug}`}
              className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
            >
              View service
              <IconArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* story-style segments: past = filled, current = filling, next = empty */}
      <div className="mt-2 flex items-center gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Show ${it.name}`}
            aria-current={i === active}
            className="group relative h-4 flex-1 focus-visible:outline-none"
          >
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-[height] duration-200 group-hover:h-1.5 group-focus-visible:ring-2 group-focus-visible:ring-aqua/60">
              {i < active && <span className="absolute inset-0 bg-aqua/50" />}
              {i === active &&
                (running ? (
                  <span key={`run-${active}`} className="svc-fill absolute inset-0 bg-aqua" />
                ) : (
                  <span className="absolute inset-0 bg-aqua" />
                ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Mobile / tablet: clean tappable grid, no pointer physics                   */
/* -------------------------------------------------------------------------- */

function MobileGrid({ reduce }: { reduce: boolean }) {
  return (
    <motion.ul
      initial={reduce ? false : "hidden"}
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } } }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden"
    >
      {items.map((s) => (
        <motion.li
          key={s.slug}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
          }}
        >
          <Link
            href={`/services/${s.slug}`}
            className="group relative flex h-full min-h-[6.5rem] flex-col justify-end gap-6 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-paper transition-colors duration-300 hover:border-aqua active:border-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
          >
            <span className="text-sm font-medium leading-snug">{s.name}</span>
            <IconArrowRight className="absolute right-4 top-4 h-4 w-4 -rotate-45 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-aqua" />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Orbit (desktop)                                                            */
/*  - pointer position lives in motion values: zero React renders per move     */
/*  - nodes are pulled gently toward the cursor so they are easy to hit        */
/*  - the field tilts in 3D and a spotlight follows the cursor                 */
/* -------------------------------------------------------------------------- */

function Orbit({
  active,
  running,
  live,
  reduce,
  onPick,
  setHold,
}: {
  active: number;
  running: boolean;
  live: boolean;
  reduce: boolean;
  onPick: (i: number) => void;
  setHold: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 620, h: 620 });
  const rect = useRef<DOMRect | null>(null);

  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const glow = useSpring(0, { stiffness: 120, damping: 20 });

  const rotX = useSpring(useTransform(ny, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 110, damping: 18 });
  const rotY = useSpring(useTransform(nx, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 110, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${mx}px ${my}px, rgba(110,231,240,0.16), transparent 70%)`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      size.current = { w: node.offsetWidth, h: node.offsetHeight };
      rect.current = null;
    };
    const invalidate = () => {
      rect.current = null;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("scroll", invalidate, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", invalidate);
    };
  }, []);

  function onEnter(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    glow.set(1);
  }
  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    if (!rect.current) rect.current = ref.current.getBoundingClientRect();
    const r = rect.current;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    nx.set(x / r.width - 0.5);
    ny.set(y / r.height - 0.5);
  }
  function onLeave() {
    mx.set(-999);
    my.set(-999);
    nx.set(0);
    ny.set(0);
    glow.set(0);
  }

  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.88 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <div
      ref={ref}
      data-live={live}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="glass-dark dotted-surface relative isolate mx-auto hidden aspect-square w-full max-w-[520px] overflow-hidden rounded-[28px] [--line:rgba(255,255,255,0.08)] lg:block"
    >
      {/* ambient light + cursor spotlight */}
      <div className="absolute inset-[22%] rounded-full bg-teal/20 blur-3xl" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlight, opacity: glow }}
      />
      <span className="pointer-events-none absolute left-5 top-4 z-30 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
        Service map
      </span>

      {/* tilted stage */}
      <motion.div className="absolute inset-0" style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}>
        {/* rings */}
        <motion.div
          aria-hidden
          {...appear(0.15)}
          className="pointer-events-none absolute inset-[3%] rounded-full border border-white/[0.06]"
        >
          <div className="svc-orbit-rev absolute inset-0">
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
          </div>
        </motion.div>
        <motion.div
          aria-hidden
          {...appear(0.3)}
          className="pointer-events-none absolute rounded-full border border-dashed border-white/[0.12]"
          style={{ inset: `${50 - R}%` }}
        >
          <div className="svc-orbit absolute inset-0">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua shadow-[0_0_14px_3px_rgba(94,234,212,0.55)]" />
          </div>
        </motion.div>
        <motion.div
          aria-hidden
          {...appear(0.45)}
          className="pointer-events-none absolute inset-[34%] rounded-full border border-white/[0.07]"
        />

        <Lines active={active} reduce={reduce} />
        <Hub active={active} />

        {items.map((s, i) => (
          <Node
            key={s.slug}
            index={i}
            name={s.name}
            href={`/services/${s.slug}`}
            spot={spots[i]}
            isActive={active === i}
            running={running}
            onPick={onPick}
            setHold={setHold}
            size={size}
            mx={mx}
            my={my}
            reduce={reduce}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Connection lines: the active one lights up and flows toward the node       */
/* -------------------------------------------------------------------------- */

const Lines = memo(function Lines({ active, reduce }: { active: number; reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
    >
      {spots.map((p, i) => {
        const on = active === i;
        return (
          <line
            key={i}
            x1={50}
            y1={50}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth={on ? 1.6 : 1}
            strokeDasharray="3 9"
            strokeLinecap="round"
            className={`transition-colors duration-500 ${on ? "svc-flow text-aqua" : "text-white/[0.1]"}`}
          />
        );
      })}
    </motion.svg>
  );
});

/* -------------------------------------------------------------------------- */
/*  Hub: shows which service is in focus                                       */
/* -------------------------------------------------------------------------- */

const Hub = memo(function Hub({ active }: { active: number }) {
  const s = items[active];
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 aspect-square w-[32%] -translate-x-1/2 -translate-y-1/2">
      <span className="svc-pulse absolute inset-0 rounded-full border border-aqua/40" />
      <span className="svc-pulse absolute inset-0 rounded-full border border-aqua/30" style={{ animationDelay: "1.8s" }} />
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-teal/40 to-teal-deep/50 px-4 text-center shadow-[0_0_60px_-10px_rgba(94,234,212,0.5)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.22, ease }}
            className="flex flex-col items-center"
          >
            <span className="line-clamp-3 font-display text-xl leading-tight text-paper">{s.name}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Node: a round marker with its label pointing away from the hub             */
/*  The active node shows a progress ring that fills during the tour.          */
/* -------------------------------------------------------------------------- */

const spring = { stiffness: 170, damping: 17, mass: 0.7 };

const labelPos: Record<Side, string> = {
  right: "left-full top-1/2 ml-3 -translate-y-1/2 text-left max-w-[5.75rem]",
  left: "right-full top-1/2 mr-3 -translate-y-1/2 text-right max-w-[5.75rem]",
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2 text-center max-w-[9rem]",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2 text-center max-w-[9rem]",
};

const Node = memo(function Node({
  index,
  name,
  href,
  spot,
  isActive,
  running,
  onPick,
  setHold,
  size,
  mx,
  my,
  reduce,
}: {
  index: number;
  name: string;
  href: string;
  spot: { x: number; y: number; side: Side };
  isActive: boolean;
  running: boolean;
  onPick: (i: number) => void;
  setHold: (v: boolean) => void;
  size: React.MutableRefObject<{ w: number; h: number }>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean;
}) {
  // Gentle magnetic pull toward the cursor (max 10px) so nodes are easy to hit.
  const calc =
    (axis: 0 | 1) =>
    ([px, py]: number[]) => {
      if (px < -500) return 0;
      const { w, h } = size.current;
      const dx = px - (spot.x / 100) * w;
      const dy = py - (spot.y / 100) * h;
      const d = Math.hypot(dx, dy) || 1;
      if (d > 150) return 0;
      return ((axis === 0 ? dx : dy) / d) * (1 - d / 150) ** 2 * 10;
    };

  const x = useSpring(useTransform([mx, my], calc(0)), spring);
  const y = useSpring(useTransform([mx, my], calc(1)), spring);

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? "z-20" : "z-10"}`}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <motion.div
        style={{ x, y }}
        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 + index * 0.08, ease }}
      >
        <div
          className="svc-float"
          style={
            {
              "--fy": `${index % 2 ? -5 : 5}px`,
              "--fd": `${4.6 + index * 0.35}s`,
              "--fl": `${-index * 0.7}s`,
            } as React.CSSProperties
          }
        >
          <Link
            href={href}
            onMouseEnter={() => onPick(index)}
            onFocus={() => {
              onPick(index);
              setHold(true);
            }}
            onBlur={() => setHold(false)}
            aria-label={name}
            className="relative block h-11 w-11 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-aqua/30"
          >
            {isActive && (
              <span className="svc-pulse pointer-events-none absolute inset-0 rounded-full border border-aqua/60" />
            )}

            <span
              className={`absolute inset-0 grid place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow,transform] duration-300 ${
                isActive
                  ? "scale-110 border-aqua bg-aqua text-ink shadow-[0_10px_34px_-8px_rgba(94,234,212,0.7)]"
                  : "border-white/15 bg-white/[0.08] text-aqua"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${isActive ? "bg-ink" : "bg-aqua"}`}
              />
            </span>

            {isActive && running && (
              <svg viewBox="0 0 44 44" className="pointer-events-none absolute -inset-1 h-[3.25rem] w-[3.25rem] -rotate-90" aria-hidden>
                <circle
                  key={`ring-${index}`}
                  className="svc-ring"
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgba(94,234,212,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transform: "scale(1)", transformOrigin: "center" }}
                />
              </svg>
            )}

            <span
              className={`pointer-events-none absolute w-max text-xs font-medium leading-snug transition-[color,opacity] duration-300 ${labelPos[spot.side]} ${
                isActive ? "text-paper" : "text-white/55"
              }`}
            >
              {name}
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
});