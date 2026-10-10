"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import Magnetic from "@/components/motion/Magnetic";
import HeroCrumbs from "./HeroCrumbs";
import { IconArrowRight } from "@/components/icons";
import type { Client } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ClientDetailHero({ client }: { client: Client }) {
  const rows: [string, string][] = [
    ["Industry", client.sector],
    ["Partnership", client.ongoing ? "Ongoing" : client.partnership],
    ["Focus", client.focus],
    ["Services in play", `${client.tags.length} areas`],
  ];
  return (
    <section className="hero-dark relative overflow-hidden rounded-b-[2.25rem] pb-20 pt-12 text-paper md:rounded-b-[4rem] md:pb-28 md:pt-16">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
        <div className="mesh-blob three" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />

      <div className="wrap relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <HeroCrumbs
            tone="dark"
            crumbs={[{ href: "/clients", label: "Clients" }, { href: `/clients/${client.slug}`, label: client.name }]}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber"
          >
            {client.sector}
          </motion.span>
          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.06] sm:text-5xl md:text-[3.5rem]">
            <WordReveal text={client.name} stagger={0.06} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-slate-on-ink"
          >
            {client.summary}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease }}
            className="mt-8"
          >
            <Magnetic>
              <Link href="/contact" className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-7 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-paper">
                Discuss a similar project
                <IconArrowRight className="h-4 w-4 -rotate-45" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="glass-dark rounded-3xl p-6 md:p-8"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-aqua">At a glance</p>
          {rows.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.09, duration: 0.5, ease }}
              className="flex items-start justify-between gap-6 border-b border-white/10 py-4 last:border-b-0"
            >
              <dt className="text-sm text-slate-on-ink">{k}</dt>
              <dd className="max-w-[60%] text-right text-sm font-semibold text-paper">{v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
