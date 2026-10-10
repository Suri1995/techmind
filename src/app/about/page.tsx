import Link from "next/link";
import type { Metadata } from "next";
import AboutHero from "@/components/heroes/AboutHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import CTA from "@/components/home-components/cta";
import { process, values, stats, sectors } from "@/lib/data";
import { IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Tech.Mind is a Hyderabad digital marketing partner combining strategy, creativity and performance, from paid media and SEO to video, websites and web applications.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <section className="wrap grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Our story" title="Marketing works best when one team owns the whole journey." />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-4 text-base leading-relaxed text-slate md:text-lg">
            <p>
              Too many businesses split their marketing across vendors who never talk to each other: one for ads, one for the
              website, another for video. The result is a message that changes at every handoff and results nobody can fully explain.
            </p>
            <p>
              Tech.Mind brings those pieces together. Our team plans the strategy, creates the content, runs the paid media, builds
              the website or web application, and tracks what happens next, so every part supports the same goal.
            </p>
            <p>
              We work with clinics, hotels, real estate developers, jewellery brands, farms and pet service providers, each with a
              different audience and a different budget. That variety keeps our thinking practical.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line bg-paper-raised py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeading eyebrow="What we believe" title="The principles behind every engagement." />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.1}>
            {values.map((value, i) => (
              <RevealItem key={value.title}>
                <div className="spot-card card-lift h-full rounded-3xl border border-line bg-paper p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-tint text-sm font-bold text-teal-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-xl text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{value.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="wrap py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="How we work" title="Clear strategy. Thoughtful execution." description="We align the right channels with your goals, then learn and optimize as campaigns develop." />
        </Reveal>
        <div className="relative mt-12">
          <RevealGroup className="grid gap-8 md:grid-cols-4" stagger={0.1}>
            {process.map((step) => (
              <RevealItem key={step.step}>
                <div className="border-t-2 border-amber pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-deep">{step.step} / {step.title}</span>
                  <h3 className="mt-3 font-display text-xl text-ink">{step.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line bg-ink py-16 text-paper md:py-24">
        <div className="mesh-hero mesh-dark">
          <div className="mesh-grid on-ink" />
          <div className="mesh-blob one" />
        </div>
        <RevealGroup className="wrap relative grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.1}>
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <Counter value={stat.value} className="font-display text-4xl md:text-5xl" />
              <p className="mt-2 text-sm text-slate-on-ink">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="wrap py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Industries" title="Where we work." description="Explore the brands we support in each sector." />
        </Reveal>
        <RevealGroup className="mt-10 flex flex-wrap gap-3" stagger={0.05}>
          {sectors.map((s) => (
            <RevealItem key={s}>
              <Link href="/clients" className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-teal-deep hover:text-teal-deep">
                {s}
                <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CTA />
    </>
  );
}
