"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/data";

/** Services orbiting a shared goal. Hover or focus a node to light up its connection. */
export default function ChannelHub() {
  const [active, setActive] = useState<string | null>(null);
  const n = services.length;
  const R = 38; // percent radius

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <div className="absolute inset-[10%] rounded-full bg-teal/15 blur-3xl" aria-hidden />
      <svg viewBox="-50 -50 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle r={R} fill="none" stroke="var(--line)" strokeDasharray="1 2.2" />
        <circle r={R * 0.55} fill="none" stroke="var(--line)" />
        <g className="orbit-spin" style={{ ["--orbit-speed" as string]: "60s" }}>
          <circle cx={R} cy="0" r="1.2" fill="var(--amber)" />
        </g>
        {services.map((s, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const on = active === s.slug;
          return (
            <line
              key={s.slug}
              x1="0"
              y1="0"
              x2={Math.cos(a) * R}
              y2={Math.sin(a) * R}
              stroke={on ? "var(--teal-deep)" : "var(--line)"}
              strokeWidth={on ? 0.7 : 0.4}
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink text-center text-paper shadow-[var(--shadow-lift)]">
        <span className="font-display text-[0.95rem] leading-tight md:text-lg">Your goals</span>
        <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-aqua md:text-[0.65rem]">at the centre</span>
      </div>

      {services.map((s, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const left = 50 + Math.cos(a) * R;
        const top = 50 + Math.sin(a) * R;
        const on = active === s.slug;
        return (
          <motion.div
            key={s.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              href={`/services/${s.slug}`}
              onMouseEnter={() => setActive(s.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.slug)}
              onBlur={() => setActive(null)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold shadow-[var(--shadow-soft)] transition-all duration-300 md:px-3.5 md:py-2 md:text-xs ${
                on
                  ? "scale-110 border-teal-deep bg-teal-deep text-paper"
                  : "border-line bg-paper-raised text-ink-soft hover:border-teal-deep"
              }`}
            >
              <span className="hidden sm:inline">{s.name.replace("Cinema Graphics & Video Editing", "Video & Graphics").replace("Complete Performance Marketing", "Performance").replace("Website & App Development", "Websites & Apps")}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
