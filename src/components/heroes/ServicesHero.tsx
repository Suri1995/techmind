"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { services } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
// Resting positions (percent of the field) for up to eight services.
const spots = [
  { x: 4, y: 8 },
  { x: 52, y: 4 },
  { x: 26, y: 26 },
  { x: 60, y: 38 },
  { x: 2, y: 48 },
  { x: 38, y: 58 },
  { x: 6, y: 80 },
  { x: 52, y: 80 },
];

/** Dark hero with a field of service chips that drift away from the cursor. Click one to jump to it. */
export default function ServicesHero() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);

  useEffect(() => {
    const node = fieldRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !fieldRef.current) return;
    const r = fieldRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }
  function onLeave() {
    mx.set(-999);
    my.set(-999);
  }

  const current = hovered === null ? null : services[hovered];

  return (
    <section className="hero-dark relative overflow-hidden pb-16 pt-12 text-paper md:pb-24 md:pt-16">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />

      <div className="wrap relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <HeroCrumbs tone="dark" crumbs={[{ href: "/services", label: "Services" }]} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-aqua">
            Services
          </motion.p>
          <h1 className="mt-4 font-display text-[2.4rem] leading-[1.08] sm:text-5xl md:text-[3.4rem]">
            <WordReveal text="Eight services." stagger={0.07} />
            <br />
            <WordReveal text="One connected team." delay={0.3} stagger={0.07} gradient />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="mt-6 max-w-md text-lg leading-relaxed text-slate-on-ink"
          >
            Complete digital marketing solutions under one roof, from paid media, search and creative to websites and web applications.
          </motion.p>
          <div className="mt-6 h-16 max-w-md" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={hovered ?? "hint"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-sm leading-relaxed text-aqua"
              >
                {current ? current.short : "Move your cursor through the field, then pick a service to explore it in detail."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div
          ref={fieldRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="glass-dark dotted-surface relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[28px] [--line:rgba(255,255,255,0.08)]"
        >
          <div className="absolute inset-[20%] rounded-full bg-teal/20 blur-3xl" aria-hidden />
          {services.slice(0, spots.length).map((s, i) => (
            <ServiceChip
              key={s.slug}
              index={i}
              name={s.name}
              href={`/services/${s.slug}`}
              spot={spots[i]}
              size={size}
              mx={mx}
              my={my}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceChip({
  index,
  name,
  href,
  spot,
  size,
  mx,
  my,
  onHover,
}: {
  index: number;
  name: string;
  href: string;
  spot: { x: number; y: number };
  size: { w: number; h: number };
  mx: MotionValue<number>;
  my: MotionValue<number>;
  onHover: (i: number | null) => void;
}) {
  const cx = (spot.x / 100) * size.w + 60;
  const cy = (spot.y / 100) * size.h + 20;
  const push = (axis: 0 | 1) => (m: number[]) => {
    const dx = cx - m[0];
    const dy = cy - m[1];
    const d = Math.hypot(dx, dy) || 1;
    const force = Math.max(0, 1 - d / 150) * 46;
    return ((axis === 0 ? dx : dy) / d) * force;
  };
  const x = useSpring(useTransform([mx, my], push(0)), { stiffness: 160, damping: 16 });
  const y = useSpring(useTransform([mx, my], push(1)), { stiffness: 160, damping: 16 });

  return (
    <motion.div
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, x, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.08, ease }}
      className="absolute"
    >
      <motion.div
        animate={{ y: [0, index % 2 ? -6 : 6, 0] }}
        transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link
          href={href}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(index)}
          onBlur={() => onHover(null)}
          className="block whitespace-nowrap rounded-full border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm font-medium text-paper backdrop-blur-md transition-colors duration-300 hover:border-aqua hover:bg-aqua hover:text-ink focus-visible:border-aqua focus-visible:bg-aqua focus-visible:text-ink"
        >
          {name}
        </Link>
      </motion.div>
    </motion.div>
  );
}
