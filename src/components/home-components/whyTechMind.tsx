"use client";

import { useEffect, useId, useRef, type CSSProperties, type PointerEvent } from "react";

const points = [
  {
    title: "One accountable team",
    text: "One team from strategy through to execution, so nothing gets lost between vendors",
  },
  {
    title: "Tailored to you",
    text: "Plans tailored to your business goals, audience, and budget",
  },
  {
    title: "Aligned, then optimized",
    text: "The right channels aligned with your goals, then learned from and optimized as campaigns develop",
  },
  {
    title: "Guided by data",
    text: "Practical next steps guided by the performance data available",
  },
];

const pillars = ["Strategy", "Creativity", "Performance"];

/* Motion is CSS only (transform and opacity), triggered once by a single observer. */
const CSS = `
.wt-glow{
  background:
    radial-gradient(48rem 20rem at 50% 0%, rgba(20,184,166,.10), transparent 70%),
    radial-gradient(30rem 16rem at 100% 100%, rgba(56,189,248,.07), transparent 70%);
}
.wt-reveal{
  opacity:0;
  transform:translate3d(0,18px,0);
  transition:opacity .7s ease var(--d,0s), transform .8s cubic-bezier(.22,1,.36,1) var(--d,0s);
}
.wt[data-revealed="true"] .wt-reveal{opacity:1;transform:none}

.wt-mark{
  background-image:linear-gradient(90deg,#14b8a6,#38bdf8);
  background-repeat:no-repeat;
  background-position:0 96%;
  background-size:0% .16em;
  padding-bottom:.04em;
  transition:background-size .9s cubic-bezier(.22,1,.36,1) var(--d,.3s);
}
.wt[data-revealed="true"] .wt-mark{background-size:100% .16em}

.wt-sweep{
  position:absolute;top:0;bottom:0;left:0;width:35%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent);
  transform:translate3d(-120%,0,0);
  pointer-events:none;
}
.wt[data-revealed="true"] .wt-sweep{animation:wt-sweep 1.8s cubic-bezier(.22,1,.36,1) .6s 1 forwards}
@keyframes wt-sweep{to{transform:translate3d(320%,0,0)}}

@media (prefers-reduced-motion:reduce){
  .wt-reveal{opacity:1;transform:none;transition:none}
  .wt-mark{background-size:100% .16em;transition:none}
  .wt-sweep{display:none}
}
`;

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function WhyTechMind() {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  // One observer, fires once, then disconnects.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = "true";
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cursor spotlight: one delegated handler for all cards, mouse only.
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className="wt relative overflow-hidden border-t border-line bg-paper-raised py-16 md:py-24"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="wt-glow pointer-events-none absolute inset-0" />

      <div className="wrap relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="wt-reveal inline-flex items-center gap-3 text-sm font-semibold text-teal-deep">
            <span aria-hidden="true" className="h-px w-8 bg-teal-deep/40" />
            Why Tech.Mind
            <span aria-hidden="true" className="h-px w-8 bg-teal-deep/40" />
          </p>

          <h2
            id={headingId}
            style={{ "--d": "0.08s" } as CSSProperties}
            className="wt-reveal mt-5 font-display text-3xl font-semibold leading-[1.12] text-ink md:text-5xl"
          >
            <span className="wt-mark" style={{ "--d": "0.4s" } as CSSProperties}>
              Strategy
            </span>
            ,{" "}
            <span className="wt-mark" style={{ "--d": "0.55s" } as CSSProperties}>
              creativity
            </span>{" "}
            and{" "}
            <span className="wt-mark" style={{ "--d": "0.7s" } as CSSProperties}>
              performance
            </span>
            , working as one.
          </h2>

          <p
            style={{ "--d": "0.16s" } as CSSProperties}
            className="wt-reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg"
          >
            Most marketing struggles when channels are run in isolation. We connect paid media, search, content,
            video and development around a single goal: yours.
          </p>
        </div>

        {/* Benefit cards */}
        <ul onPointerMove={onPointerMove} className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
          {points.map((point, i) => (
            <li
              key={point.title}
              data-card
              style={{ "--d": `${0.2 + i * 0.09}s` } as CSSProperties}
              className="wt-reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 hover:border-teal-deep/30 hover:shadow-[0_28px_50px_-28px_rgba(15,60,60,0.35)] motion-safe:hover:-translate-y-1 md:p-8"
            >
              {/* Cursor spotlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(280px_circle_at_var(--mx,50%)_var(--my,0%),rgba(20,184,166,0.12),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              {/* Accent bar draws in on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal to-sky-400 transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
              />

              <div className="relative flex items-start gap-4 md:gap-5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal-deep transition-colors duration-500 group-hover:bg-teal-deep group-hover:text-white"
                >
                  <IconCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-snug text-ink">{point.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft">{point.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Goals band */}
        <div
          style={{ "--d": "0.6s" } as CSSProperties}
          className="wt-reveal relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b2a2c] via-[#08201f] to-[#041514] p-8 md:mt-6 md:p-10"
        >
          <span aria-hidden="true" className="wt-sweep" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">At the centre</p>
              <p className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Your goals.</p>
            </div>
            <ul className="flex flex-wrap gap-3" aria-label="What we align around your goals">
              {pillars.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}