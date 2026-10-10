"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/icons";
import { company, getService } from "@/lib/data";

const goals = [
  { id: "seen", label: "Get seen by more people", picks: ["meta-ads", "influencer-marketing", "video-editing"] },
  { id: "enquiries", label: "Get more enquiries", picks: ["google-ads", "meta-ads", "performance-marketing"] },
  { id: "sell", label: "Sell online", picks: ["website-app-development", "google-ads", "meta-ads"] },
  { id: "local", label: "Show up locally", picks: ["seo", "google-ads"] },
  { id: "content", label: "Create standout content", picks: ["video-editing", "influencer-marketing"] },
  { id: "site", label: "Get a new website", picks: ["website-app-development", "seo"] },
  { id: "automate", label: "Streamline how we work", picks: ["web-applications"] },
  { id: "joined", label: "Make every channel work together", picks: ["performance-marketing"] },
];

export default function Planner() {
  const [picked, setPicked] = useState<string[]>(["enquiries"]);

  const plan = useMemo(() => {
    const score = new Map<string, string[]>();
    goals
      .filter((g) => picked.includes(g.id))
      .forEach((g) =>
        g.picks.forEach((slug, rank) => {
          const list = score.get(slug) ?? [];
          list.push(g.label + (rank === 0 ? "|1" : ""));
          score.set(slug, list);
        }),
      );
    return [...score.entries()]
      .map(([slug, reasons]) => ({
        service: getService(slug)!,
        reasons: reasons.map((r) => r.replace("|1", "")),
        weight: reasons.reduce((a, r) => a + (r.endsWith("|1") ? 2 : 1), 0),
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 4);
  }, [picked]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const mailto = `mailto:${company.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(
    `Goals: ${goals.filter((g) => picked.includes(g.id)).map((g) => g.label).join(", ")}\nServices of interest: ${plan
      .map((p) => p.service.name)
      .join(", ")}\n\nA little about my business:\n`,
  )}`;

  return (
    <section className="py-16 md:py-24">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            eyebrow="Plan your growth"
            title="Tell us what you want to achieve. We'll suggest where to start."
            description="Pick your goals and see a starting mix of services. We refine it together once we understand your business, audience and budget."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid overflow-hidden rounded-[32px] border border-line bg-paper-raised shadow-[var(--shadow-lift)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-7 md:p-10">
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  What would you like marketing to do? <span className="font-normal text-slate">Select any that apply</span>
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {goals.map((g) => {
                    const on = picked.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggle(g.id)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          on
                            ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                            : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <p className="mt-8 text-xs leading-relaxed text-slate">
                This is a starting suggestion, not a quote. Plans are tailored to your business goals, audience, and budget.
              </p>
            </div>

            <div className="hero-dark relative overflow-hidden p-7 text-paper md:p-10">
              <div className="hero-beam" />
              <div className="noise-overlay" />
              <div className="relative">
                <p className="text-sm text-slate-on-ink">Suggested starting mix</p>
                {plan.length === 0 ? (
                  <p className="mt-6 font-display text-xl text-paper">Pick a goal to see where we would start.</p>
                ) : (
                  <ol className="mt-5 space-y-3" aria-live="polite">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {plan.map((p, i) => (
                        <motion.li
                          key={p.service.slug}
                          layout
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            href={`/services/${p.service.slug}`}
                            className="group glass-dark flex items-start gap-4 rounded-2xl p-4 transition-colors hover:border-aqua/50"
                          >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-aqua">
                              {i + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="font-display text-lg">{p.service.name}</span>
                                {i === 0 && (
                                  <span className="rounded-full bg-amber px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink">Start here</span>
                                )}
                              </span>
                              <span className="mt-1 block text-xs text-slate-on-ink">For: {p.reasons.join(" · ")}</span>
                            </span>
                            <IconArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-on-ink transition-transform group-hover:translate-x-1 group-hover:text-aqua" />
                          </Link>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ol>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href={`/contact${plan[0] ? `?service=${plan[0].service.slug}` : ""}`}
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
                  >
                    Discuss this plan
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={mailto} className="link-underline text-sm font-semibold text-slate-on-ink hover:text-paper">
                    Email this summary
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
