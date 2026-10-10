"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { clients, sectors, type Client } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

function Plate({ c }: { c: Client }) {
  return (
    <Link
      href={`/clients/${c.slug}`}
      className="group glass-dark flex shrink-0 items-center gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-aqua/60"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-display text-lg text-aqua">
        {c.name.charAt(0)}
      </span>
      <span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber">{c.sector}</span>
        <span className="block font-display text-base leading-tight text-paper group-hover:text-aqua">{c.name}</span>
      </span>
    </Link>
  );
}

/** Centered title over two counter-scrolling bands of clients. Hover to pause, click to open. */
export default function ClientsHero() {
  const a = [...clients, ...clients];
  const b = [...clients].reverse();
  const bb = [...b, ...b];
  const stats: [string, string][] = [
    [String(clients.length), "brands"],
    [String(sectors.length), "industries"],
    ["5 years", "longest partnership"],
  ];

  return (
    <section className="hero-dark relative overflow-hidden pb-16 pt-12 text-paper md:pb-24 md:pt-16">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />

      <div className="wrap relative text-center">
        <div className="flex justify-center">
          <HeroCrumbs tone="dark" crumbs={[{ href: "/clients", label: "Clients" }]} />
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua">
          Our clients
        </motion.p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-[2.4rem] leading-[1.08] sm:text-5xl md:text-[3.5rem]">
          <WordReveal text="Brands We're Proud to Work With" stagger={0.06} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-on-ink"
        >
          Ongoing partnerships across real estate, healthcare, jewellery, hospitality, wellness, farming, and pet training.
        </motion.p>
        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {stats.map(([v, l]) => (
            <li key={l} className="glass-dark flex items-baseline gap-2 rounded-2xl px-4 py-2.5">
              <span className="font-display text-xl">{v}</span>
              <span className="text-sm text-slate-on-ink">{l}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="band-wrap relative mt-14 space-y-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="band-left flex w-max gap-4" style={{ ["--band-speed" as string]: "50s" }}>
          {a.map((c, i) => <Plate key={`a${i}`} c={c} />)}
        </div>
        <div className="band-right flex w-max gap-4" style={{ ["--band-speed" as string]: "58s" }}>
          {bb.map((c, i) => <Plate key={`b${i}`} c={c} />)}
        </div>
      </div>
    </section>
  );
}
