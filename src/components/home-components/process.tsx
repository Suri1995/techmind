"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { process } from "@/lib/data";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-28">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>
      <div className="noise-overlay" />
      <div className="wrap relative">
        <Reveal>
          <SectionHeading
            eyebrow="Our approach"
            title="Clear Strategy. Thoughtful Execution."
            tone="paper"
            description="We align the right channels with your goals, then learn and optimize as campaigns develop."
          />
        </Reveal>

        <div ref={ref} className="relative mt-16">
          {/* Track + scroll-filled line (horizontal on desktop, vertical on mobile) */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line-dark md:inset-x-0 md:bottom-auto md:left-0 md:top-[7px] md:h-px md:w-auto">
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top bg-gradient-to-b from-teal to-amber md:hidden"
            />
            <motion.div
              style={{ scaleX: progress }}
              className="hidden h-full w-full origin-left bg-gradient-to-r from-teal to-amber md:block"
            />
          </div>

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {process.map((item, i) => (
              <Step
                key={item.step}
                item={item}
                index={i}
                total={process.length}
                progress={progress}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof process)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // A step lights up as the fill line reaches its position.
  const at = index / (total - 1 || 1);
  const lit = useTransform(progress, [Math.max(at - 0.12, 0), at], [0, 1]);
  const dotScale = useTransform(lit, [0, 1], [0.7, 1.25]);
  const textOpacity = useTransform(lit, [0, 1], [0.45, 1]);

  return (
    <li className="relative pl-9 md:pl-0 md:pt-10">
      <motion.span
        style={{ scale: dotScale, backgroundColor: useTransform(lit, [0, 1], ["#1d4a4c", "#14b8a6"]) }}
        className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full ring-4 ring-ink md:top-0"
      />
      <motion.div style={{ opacity: textOpacity }}>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber">
          {item.step} / {item.title}
        </span>
        <h3 className="mt-3 font-display text-xl">{item.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-on-ink">{item.text}</p>
        <ul className="mt-4 space-y-1.5 text-xs text-slate-on-ink/80">
          {item.points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" />
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}
