"use client";

import { useEffect, useId, useRef, type CSSProperties, type PointerEvent } from "react";
import { process as steps } from "@/lib/data";

/* Motion is CSS only (transform and opacity). Two lightweight observers add data attributes;
   there are no scroll listeners, springs or per-frame JavaScript. */
const CSS = `
.wp-bg{
  background:
    radial-gradient(50rem 24rem at 15% 0%, rgba(20,184,166,.16), transparent 70%),
    radial-gradient(36rem 20rem at 90% 100%, rgba(245,158,11,.10), transparent 70%);
}
.wp-grid{
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size:56px 56px;
  -webkit-mask-image:radial-gradient(ellipse at 50% 30%, #000, transparent 75%);
  mask-image:radial-gradient(ellipse at 50% 30%, #000, transparent 75%);
}

.wp-reveal{
  opacity:0;
  transform:translate3d(0,16px,0);
  transition:opacity .7s ease var(--d,0s), transform .8s cubic-bezier(.22,1,.36,1) var(--d,0s);
}
.wp[data-revealed="true"] .wp-reveal{opacity:1;transform:none}

/* Each step lights up once, as it enters the viewport */
.wp-step{
  opacity:.6;
  transform:translate3d(0,14px,0);
  transition:opacity .8s ease calc(var(--i,0) * .16s), transform .9s cubic-bezier(.22,1,.36,1) calc(var(--i,0) * .16s);
}
.wp-step[data-lit="true"]{opacity:1;transform:none}

.wp-node{
  position:absolute;left:0;top:.375rem;
  width:15px;height:15px;border-radius:9999px;
  background:#1d4a4c;
  transform:scale(.8);
  transition:
    background-color .5s ease calc(var(--i,0) * .16s + .15s),
    transform .5s cubic-bezier(.22,1,.36,1) calc(var(--i,0) * .16s + .15s),
    box-shadow .5s ease calc(var(--i,0) * .16s + .15s);
}
.wp-node::after{
  content:"";position:absolute;inset:0;border-radius:inherit;
  border:1.5px solid rgba(20,184,166,.7);opacity:0;
}
.wp-step[data-lit="true"] .wp-node{
  background:#14b8a6;
  transform:scale(1.2);
  box-shadow:0 0 0 4px rgba(20,184,166,.18), 0 0 18px rgba(20,184,166,.55);
}
.wp-step[data-lit="true"] .wp-node::after{
  animation:wp-pulse 1.4s ease-out calc(var(--i,0) * .16s + .2s) 1 both;
}
@keyframes wp-pulse{
  from{transform:scale(1);opacity:.8}
  to{transform:scale(2.8);opacity:0}
}

/* Connector from this step's node to the next one (vertical on mobile) */
.wp-seg{
  position:absolute;left:7px;top:31px;
  width:1px;height:calc(100% + 3rem - 35px);
  background:rgba(255,255,255,.12);
  overflow:hidden;
}
.wp-seg::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(to bottom,#14b8a6,#f59e0b);
  transform:scaleY(0);transform-origin:top;
  transition:transform .9s cubic-bezier(.22,1,.36,1) calc(var(--i,0) * .16s + .4s);
}
.wp-step[data-lit="true"] .wp-seg::after{transform:scaleY(1)}

@media (min-width:768px){
  .wp-node{top:0}
  .wp-seg{left:25px;top:7px;width:calc(100% + 2rem - 35px);height:1px}
  .wp-seg::after{
    background:linear-gradient(to right,#14b8a6,#f59e0b);
    transform:scaleX(0);transform-origin:left;
  }
  .wp-step[data-lit="true"] .wp-seg::after{transform:scaleX(1)}
}

@media (prefers-reduced-motion:reduce){
  .wp-reveal,.wp-step{opacity:1;transform:none;transition:none}
  .wp-node{background:#14b8a6;transform:scale(1.2);transition:none;box-shadow:0 0 0 4px rgba(20,184,166,.18)}
  .wp-node::after{display:none}
  .wp-seg::after{transform:none;transition:none}
}
`;

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function IconLoop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M4 12A8 8 0 0 1 17.7 6.4" />
      <path d="M18 3v4h-4" />
      <path d="M6 21v-4h4" />
    </svg>
  );
}

export default function Process() {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));

    if (typeof IntersectionObserver === "undefined") {
      root.dataset.revealed = "true";
      items.forEach((el) => (el.dataset.lit = "true"));
      return;
    }

    const head = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.dataset.revealed = "true";
          head.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.lit = "true";
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    head.observe(root);
    items.forEach((el) => stepObserver.observe(el));
    return () => {
      head.disconnect();
      stepObserver.disconnect();
    };
  }, []);

  // Cursor spotlight: one delegated handler for all cards, mouse only.
  const onPointerMove = (e: PointerEvent<HTMLOListElement>) => {
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
      className="wp relative overflow-hidden bg-ink py-12 text-paper md:py-20"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="wp-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="wp-grid pointer-events-none absolute inset-0" />

      <div className="wrap relative">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="wp-reveal inline-flex items-center gap-3 text-sm font-semibold text-teal">
            <span aria-hidden="true" className="h-px w-8 bg-teal/50" />
            Our approach
          </p>
          <h2
            id={headingId}
            style={{ "--d": "0.08s" } as CSSProperties}
            className="wp-reveal mt-4 font-display text-3xl font-semibold leading-[1.12] text-paper md:text-5xl"
          >
            Clear Strategy. <span className="text-teal">Thoughtful Execution.</span>
          </h2>
          <p
            style={{ "--d": "0.16s" } as CSSProperties}
            className="wp-reveal mt-5 text-base leading-relaxed text-slate-on-ink md:text-lg"
          >
            We align the right channels with your goals, then learn and optimize as campaigns develop.
          </p>
        </div>

        {/* Timeline */}
        <ol onPointerMove={onPointerMove} className="mt-14 grid gap-12 md:mt-16 md:grid-cols-4 md:gap-8">
          {steps.map((item, i) => (
            <li
              key={item.step}
              data-step
              style={{ "--i": i } as CSSProperties}
              className="wp-step relative pl-9 md:pl-0 md:pt-10"
            >
              <span aria-hidden="true" className="wp-node" />
              {i < steps.length - 1 && <span aria-hidden="true" className="wp-seg" />}

              <div
                data-card
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-[transform,border-color,background-color] duration-500 hover:border-teal/40 hover:bg-white/[0.07] motion-safe:hover:-translate-y-1.5"
              >
                {/* Cursor spotlight */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgba(20,184,166,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Decorative step number */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-3 select-none font-display text-4xl font-semibold leading-none text-white/[0.06]"
                >
                  {item.step}
                </span>

                <div className="relative">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber">
                    {item.title}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-paper">
                    {item.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-on-ink">{item.text}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm text-slate-on-ink">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Loop note */}
        <p
          style={{ "--d": "0.3s" } as CSSProperties}
          className="wp-reveal mx-auto mt-12 flex w-fit max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-slate-on-ink md:mt-14"
        >
          <IconLoop className="h-4 w-4 shrink-0 text-teal" />
          <span>What we learn in Optimize feeds the next round of planning.</span>
        </p>
      </div>
    </section>
  );
}