"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import Magnetic from "@/components/motion/Magnetic";
import ServiceArt from "@/components/ServiceArt";
import HeroCrumbs from "./HeroCrumbs";
import { IconArrowRight } from "@/components/icons";
import type { Service } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

/** Detail hero: big numbered title, requirement CTA, and a tilting illustration with channel chips. */
export default function ServiceDetailHero({ service }: { service: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateY = useTransform(px, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(py, [-0.5, 0.5], [6, -6]);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <section className="hero-dark relative overflow-hidden rounded-b-[2.25rem] pb-20 pt-12 text-paper md:rounded-b-[4rem] md:pb-28 md:pt-16">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />

      <div className="wrap relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <HeroCrumbs
            tone="dark"
            crumbs={[
              { href: "/services", label: "Services" },
              { href: `/services/${service.slug}`, label: service.name },
            ]}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 text-sm font-semibold text-aqua"
          >
            <span className="font-display text-3xl text-amber">{service.number}</span>
            <span className="h-px w-10 bg-aqua/50" />
            Service
          </motion.div>
          <h1 className="mt-4 font-display text-[2.4rem] leading-[1.06] sm:text-5xl md:text-[3.5rem]">
            <WordReveal text={service.name} delay={0.1} stagger={0.06} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="mt-5 max-w-xl text-xl leading-snug text-paper/90"
          >
            {service.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62, ease }}
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-on-ink"
          >
            {service.short}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                href={`/contact?service=${service.slug}`}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-7 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-paper"
              >
                Submit requirements
                <IconArrowRight className="h-4 w-4 -rotate-45" />
              </Link>
            </Magnetic>
            <a href="#included" className="glass-dark inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-paper transition-colors hover:border-aqua/60">
              See what&apos;s included
              <IconArrowRight className="h-4 w-4 rotate-90" />
            </a>
          </motion.div>
        </div>

        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={reset}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-xl [perspective:1100px]"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/15 shadow-[var(--shadow-lift)]"
          >
            <ServiceArt slug={service.slug} className="h-full w-full" label={service.name} />
          </motion.div>
          <ul className="absolute -bottom-5 left-4 right-4 flex flex-wrap justify-center gap-2" aria-label="Channels and formats">
            {service.channels.slice(0, 4).map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.5, ease }}
                className="rounded-full border border-white/15 bg-ink/80 px-3.5 py-1.5 text-xs font-medium text-paper backdrop-blur-md"
              >
                {c}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
