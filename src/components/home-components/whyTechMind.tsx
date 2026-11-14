"use client";

import { useEffect, useId, useRef, type CSSProperties, type PointerEvent } from "react";

const points = [
  {
    no: "01",
    title: "One Accountable Team",
    text: "One team managing everything from strategy to execution.",
  },
  {
    no: "02",
    title: "Tailored to Your Business",
    text: "Strategies built around your goals, audience, and budget.",
  },
  {
    no: "03",
    title: "Aligned & Optimized",
    text: "Connected marketing channels, continuously improved for better results.",
  },
  {
    no: "04",
    title: "Guided by Data",
    text: "Smarter decisions driven by campaign performance and insights.",
  },
];

const pillars = ["Strategy", "Creativity", "Performance"];

/* Motion is CSS only (transform and opacity), triggered once by a single observer. */
const CSS = `
.wt-glow{
  background:
    radial-gradient(48rem 20rem at 50% 0%, rgba(20,184,166,.12), transparent 70%),
    radial-gradient(32rem 18rem at 100% 100%, rgba(232,162,58,.08), transparent 70%),
    radial-gradient(28rem 16rem at 0% 70%, rgba(56,189,248,.07), transparent 70%);
}
.wt-dots{
  background-image:radial-gradient(#cfe0dc 1px,transparent 1px);
  background-size:22px 22px;
  -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000 20%,transparent 78%);
  mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000 20%,transparent 78%);
  opacity:.5;
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

.wt-grad{
  background:linear-gradient(100deg,#0b7a72,#14b8a6 55%,#e8a23a);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}

.wt-sweep{
  position:absolute;top:0;bottom:0;left:0;width:35%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);
  transform:translate3d(-120%,0,0);
  pointer-events:none;
}
.wt[data-revealed="true"] .wt-sweep{animation:wt-sweep 1.8s cubic-bezier(.22,1,.36,1) .8s 1 forwards}
@keyframes wt-sweep{to{transform:translate3d(320%,0,0)}}

.wt-num{
  font-variant-numeric:tabular-nums;
  background:linear-gradient(135deg,#0b7a72,#14b8a6 60%,#e8a23a);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}

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
      className="wt relative overflow-hidden border-t border-line bg-paper-raised py-10 md:py-20"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="wt-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="wt-dots pointer-events-none absolute inset-0" />

      <div className="wrap relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="wt-reveal inline-flex items-center gap-3 text-sm font-semibold text-teal-deep">
            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-teal-deep/50" />
            Why Tech Mind
            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-teal-deep/50" />
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
              Creativity
            </span>{" "}
            &amp;{" "}
            <span className="wt-mark" style={{ "--d": "0.7s" } as CSSProperties}>
              Performance
            </span>{" "}
            — <span className="wt-grad">All in One.</span>
          </h2>

          <p
            style={{ "--d": "0.16s" } as CSSProperties}
            className="wt-reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg"
          >
            We bring strategy, creative thinking, and performance marketing together to grow your brand across digital
            channels.
          </p>
        </div>

        {/* Benefit cards */}
        <ul onPointerMove={onPointerMove} className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
          {points.map((point, i) => (
            <li
              key={point.no}
              data-card
              style={{ "--d": `${0.2 + i * 0.09}s` } as CSSProperties}
              className="wt-reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(6,31,34,0.04),0_14px_32px_-22px_rgba(6,31,34,0.22)] transition-[transform,border-color,box-shadow] duration-500 hover:border-teal-deep/30 hover:shadow-[0_28px_50px_-26px_rgba(11,122,114,0.4)] motion-safe:hover:-translate-y-1 md:p-8"
            >
              {/* Cursor spotlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_circle_at_var(--mx,50%)_var(--my,0%),rgba(20,184,166,0.13),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              {/* Accent bar draws in on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal via-aqua to-amber transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
              />

              <div className="relative flex items-start gap-2 md:gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-teal-tint text-teal-deep ring-1 ring-teal/15 transition-[background-color,color,transform] duration-500 group-hover:bg-teal-deep group-hover:text-white motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-105"
                >
                  <IconCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="mt-0.5 font-display text-xl font-semibold leading-snug text-ink">{point.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft">{point.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pillars band (light) */}
        <div
          style={{ "--d": "0.6s" } as CSSProperties}
          className="wt-reveal relative mt-5 overflow-hidden rounded-3xl border border-teal/20 bg-gradient-to-br from-teal-tint via-white to-mist p-8 shadow-[0_1px_2px_rgba(6,31,34,0.04),0_20px_44px_-28px_rgba(11,122,114,0.35)] md:mt-6 md:p-10"
        >
          <span aria-hidden="true" className="wt-sweep" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="font-display text-3xl font-semibold text-ink md:text-4xl">
              <span className="wt-grad">All in One.</span>
            </p>
            <ul className="flex flex-wrap gap-3" aria-label="Strategy, Creativity and Performance">
              {pillars.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white px-4 py-2 text-sm font-medium text-ink shadow-[0_6px_16px_-10px_rgba(11,122,114,0.45)] transition-[transform,border-color] duration-300 hover:border-teal-deep/40 motion-safe:hover:-translate-y-0.5"
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