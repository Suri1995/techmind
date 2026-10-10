"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ServiceArt from "@/components/ServiceArt";
import { IconArrowRight } from "@/components/icons";
import { services } from "@/lib/data";

const AUTO_MS = 6000;

export default function Services() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % services.length), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const current = services[active];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mesh-hero pointer-events-none opacity-60">
        <div className="mesh-blob one" />
      </div>

      <div className="wrap relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Complete Digital Marketing Solutions Under One Roof"
              description="Choose the support you need. Share a few project details and our team can follow up with the right next steps."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/services"
              className="btn-shine inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep"
            >
              View all services
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ul className="flex flex-col" role="tablist" aria-label="Services">
              {services.map((service, i) => {
                const isActive = i === active;
                return (
                  <li key={service.slug} className="border-t border-line last:border-b">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className="group relative flex w-full items-start gap-4 py-4 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-teal-deep text-paper"
                            : "bg-teal-tint text-teal-deep group-hover:bg-teal/20"
                        }`}
                      >
                        {service.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-display text-lg transition-colors duration-300 md:text-xl ${
                            isActive ? "text-ink" : "text-slate group-hover:text-ink"
                          }`}
                        >
                          {service.name}
                        </span>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              className="block overflow-hidden text-sm leading-relaxed text-slate"
                            >
                              <span className="block pt-1.5">{service.short}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <IconArrowRight
                        className={`mt-3 h-4 w-4 shrink-0 transition-all duration-300 ${
                          isActive ? "translate-x-0 text-teal-deep opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                      />
                      {isActive && (
                        <span className="absolute inset-x-0 bottom-0 h-px bg-line">
                          <motion.span
                            key={`${active}-${paused}`}
                            className="block h-full origin-left bg-teal"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: paused ? 0 : 1 }}
                            transition={{ duration: paused ? 0 : AUTO_MS / 1000, ease: "linear" }}
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)] md:min-h-[32rem]">
              <AnimatePresence mode="sync">
                <motion.div
                  key={current.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ServiceArt slug={current.slug} className="h-full w-full" label={current.name} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.slug}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                      Service {current.number}
                    </span>
                    <h3 className="mt-4 max-w-md font-display text-3xl text-paper md:text-4xl">{current.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-on-ink">{current.tagline}</p>
                    <Link
                      href={`/services/${current.slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-amber"
                    >
                      Explore {current.name}
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
