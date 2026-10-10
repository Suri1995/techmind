"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { growthPanel } from "@/lib/data";

/** Glass "growth partner" card: tilts toward the cursor and walks its highlight down the list. */
export default function GrowthPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateY = useTransform(px, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(py, [-0.5, 0.5], [5, -5]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % growthPanel.rows.length), 2200);
    return () => window.clearInterval(id);
  }, [paused]);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
    setPaused(false);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerEnter={() => setPaused(true)}
      className="relative w-full max-w-lg [perspective:1100px]"
    >
      <div className="absolute -inset-6 rounded-[40px] bg-teal/20 blur-3xl" aria-hidden />
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="hero-dark relative overflow-hidden rounded-[28px] border border-white/10 p-7 text-paper shadow-[var(--shadow-lift)] md:p-9"
      >
        <div className="hero-beam" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-on-ink">{growthPanel.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl leading-tight md:text-[1.7rem]">{growthPanel.title}</h2>

          <ul className="mt-6" role="list">
            {growthPanel.rows.map((row, i) => {
              const on = i === active;
              return (
                <li key={row.label} className="relative border-b border-white/10 last:border-b-0">
                  {on && (
                    <motion.span
                      layoutId="growth-row"
                      className="absolute inset-x-[-0.75rem] inset-y-1 rounded-xl bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="relative flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className={`text-sm transition-colors duration-300 md:text-base ${on ? "text-paper" : "text-slate-on-ink"}`}>
                      {row.label}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-sm font-semibold transition-all duration-300 ${
                        on ? "translate-x-0 text-amber" : "translate-x-1 text-amber/70"
                      }`}
                    >
                      <span aria-hidden className={`transition-transform duration-300 ${on ? "-translate-y-0.5 translate-x-0.5" : ""}`}>↗</span>
                      {row.tag}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-xs leading-relaxed text-slate-on-ink">{growthPanel.note}</p>
        </div>
      </motion.div>
    </div>
  );
}
