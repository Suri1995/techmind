"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import Magnetic from "@/components/motion/Magnetic";
import { IconArrowRight } from "@/components/icons";
import { values } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
const traits = ["curious", "rigorous", "candid", "generous", "craft-obsessed"];
const placements = [
  { left: "2%", top: "4%", rotate: -6 },
  { left: "42%", top: "0%", rotate: 4 },
  { left: "8%", top: "46%", rotate: 3 },
  { left: "46%", top: "50%", rotate: -4 },
];

/** Warm, playful hero: a rotating trait line and value cards you can pick up and rearrange. */
export default function CareersHero() {
  const [i, setI] = useState(0);
  const [z, setZ] = useState<number[]>(values.map((_, n) => n));
  const area = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % traits.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  const bringToFront = (n: number) => setZ((o) => [...o.filter((x) => x !== n), n]);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff3dc_0%,#f9efe0_35%,var(--paper)_75%)] pb-16 pt-14 md:pb-24 md:pt-20">
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-teal/15 blur-3xl" />
      <div className="wrap relative grid gap-12 md:grid-cols-[1fr_1fr] md:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-paper-raised/70 px-3.5 py-1.5 text-sm font-medium text-ink-soft backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-amber" />
            Careers
          </motion.p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">
            <WordReveal text="Build what matters with us." stagger={0.08} />
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 font-display text-2xl text-ink-soft md:text-3xl" aria-live="polite">
            <span>We hire people who are</span>
            <span className="relative inline-flex h-[1.3em] min-w-[9ch] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={traits[i]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="text-teal-deep"
                >
                  {traits[i]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="mt-6 max-w-md text-lg leading-relaxed text-slate"
          >
            We are always looking for thoughtful marketers, creatives, and developers who care about the details and the
            difference good marketing makes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="mt-8"
          >
            <Magnetic>
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep"
              >
                Introduce yourself
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        <div ref={area} className="relative mx-auto hidden h-[26rem] w-full max-w-lg md:block">
          {values.map((v, n) => (
            <motion.div
              key={v.title}
              drag
              dragConstraints={area}
              dragElastic={0.12}
              dragMomentum={false}
              onPointerDown={() => bringToFront(n)}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: placements[n].rotate }}
              whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
              whileDrag={{ rotate: 0, scale: 1.06, cursor: "grabbing" }}
              transition={{ duration: 0.6, delay: 0.4 + n * 0.12, ease }}
              style={{ left: placements[n].left, top: placements[n].top, zIndex: z.indexOf(n) + 1 }}
              className="absolute w-[48%] cursor-grab rounded-2xl border border-line bg-paper-raised p-5 shadow-[var(--shadow-lift)]"
            >
              <span className="font-display text-sm text-amber">0{n + 1}</span>
              <h2 className="mt-2 font-display text-lg leading-snug text-ink">{v.title}</h2>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate">{v.text}</p>
            </motion.div>
          ))}
          <p className="absolute -bottom-2 right-0 text-xs text-slate">Pick them up and rearrange</p>
        </div>
      </div>
    </section>
  );
}
