import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import WordReveal from "@/components/motion/WordReveal";
import GrowthPanel from "@/components/home-components/GrowthPanel";
import { IconArrowRight } from "@/components/icons";

const trio = [
  { value: "360°", label: "Marketing Solutions" },
  { value: "8", label: "Service Categories" },
  { value: "One Team", label: "From Strategy to Execution" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20">
      <div className="mesh-hero">
        <div className="mesh-grid" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
        <div className="mesh-blob three" />
      </div>
      <div className="wrap relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Reveal>
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-line bg-paper-raised/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-deep" />
              </span>
              Strategy <span aria-hidden className="text-line">|</span> Creativity <span aria-hidden className="text-line">|</span> Performance
            </span>
          </Reveal>
          <h1 className="mt-5 font-display text-[2.7rem] leading-[1.04] text-ink sm:text-6xl md:text-[4.2rem]">
            <WordReveal text="Build Your Brand." delay={0.1} />
            <br />
            <WordReveal text="Grow With Purpose." delay={0.45} gradient />
          </h1>
          <Reveal delay={0.7}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Complete digital marketing solutions that help businesses strengthen
              visibility, generate enquiries, build customer relationships, and grow online.
            </p>
          </Reveal>
          <Reveal delay={0.85}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/contact"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep"
                >
                  Discuss Your Project
                  <IconArrowRight className="h-4 w-4 -rotate-45" />
                </Link>
              </Magnetic>
              <Link
                href="/clients"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised/70 px-7 py-4 text-sm font-semibold text-ink-soft backdrop-blur transition-colors hover:border-teal-deep hover:text-teal-deep"
              >
                Explore Our Work
                <IconArrowRight className="h-4 w-4 rotate-90" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {trio.map((t) => (
                <div key={t.label}>
                  <dt className="font-display text-xl text-ink">{t.value}</dt>
                  <dd className="mt-0.5 text-sm text-slate">{t.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.35} y={20} className="flex justify-center lg:justify-end">
          <GrowthPanel />
        </Reveal>
      </div>
    </section>
  );
}
