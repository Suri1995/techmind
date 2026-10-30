"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { company, faqs } from "@/lib/data";

type Props = {
  items?: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  description?: string;
  id?: string;
};

/* Motion is CSS only. The answer panel animates grid-template-rows (0fr to 1fr), which
   needs no height measuring. Closed panels use visibility:hidden, so their content is
   removed from the tab order and from screen readers once the close transition ends. */
const CSS = `
.faq-glow{
  background:
    radial-gradient(44rem 18rem at 0% 0%, rgba(20,184,166,.09), transparent 70%),
    radial-gradient(32rem 16rem at 100% 100%, rgba(56,189,248,.07), transparent 70%);
}
.faq-reveal{
  opacity:0;
  transform:translate3d(0,16px,0);
  transition:opacity .7s ease var(--d,0s), transform .8s cubic-bezier(.22,1,.36,1) var(--d,0s);
}
.faq[data-revealed="true"] .faq-reveal{opacity:1;transform:none}

.faq-panel{
  display:grid;
  grid-template-rows:0fr;
  visibility:hidden;
  transition:grid-template-rows .45s cubic-bezier(.22,1,.36,1), visibility 0s linear .45s;
}
.faq-panel[data-open="true"]{
  grid-template-rows:1fr;
  visibility:visible;
  transition:grid-template-rows .45s cubic-bezier(.22,1,.36,1), visibility 0s linear 0s;
}
.faq-inner{min-height:0;overflow:hidden}
.faq-answer{
  opacity:0;
  transform:translate3d(0,-6px,0);
  transition:opacity .35s ease, transform .45s cubic-bezier(.22,1,.36,1);
}
.faq-panel[data-open="true"] .faq-answer{opacity:1;transform:none;transition-delay:.08s}

@media (prefers-reduced-motion:reduce){
  .faq-reveal{opacity:1;transform:none;transition:none}
  .faq-panel,.faq-panel[data-open="true"]{transition:none}
  .faq-answer,.faq-panel[data-open="true"] .faq-answer{opacity:1;transform:none;transition:none}
}
`;

export default function FAQ({
  items = faqs,
  eyebrow = "Questions",
  title = "Questions businesses ask before they start.",
  description = "If yours isn't here, send it over and we'll reply within one business day.",
  id,
}: Props = {}) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  const headingId = `${uid}-heading`;
  const sectionRef = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Accordion keyboard pattern: Up/Down/Home/End move focus between questions.
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const count = items.length;
    const current = buttons.current.findIndex((b) => b === e.target);
    if (current === -1) return;
    let next = -1;
    if (e.key === "ArrowDown") next = (current + 1) % count;
    else if (e.key === "ArrowUp") next = (current - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next >= 0) {
      e.preventDefault();
      buttons.current[next]?.focus();
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={headingId}
      className="faq relative scroll-mt-32 border-t border-line bg-paper-raised py-16 md:py-24"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden="true" className="faq-glow pointer-events-none absolute inset-0" />

      <div className="wrap relative grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        {/* Left: heading + contact card (sticky on desktop) */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="faq-reveal inline-flex items-center gap-3 text-sm font-semibold text-teal-deep">
            <span aria-hidden="true" className="h-px w-8 bg-teal-deep/40" />
            {eyebrow}
          </p>
          <h2
            id={headingId}
            style={{ "--d": "0.08s" } as CSSProperties}
            className="faq-reveal mt-4 font-display text-3xl font-semibold leading-[1.15] text-ink md:text-4xl"
          >
            {title}
          </h2>
          <p
            style={{ "--d": "0.16s" } as CSSProperties}
            className="faq-reveal mt-5 max-w-md text-base leading-relaxed text-ink-soft"
          >
            {description}
          </p>

          <div
            style={{ "--d": "0.26s" } as CSSProperties}
            className="faq-reveal mt-8 rounded-3xl bg-gradient-to-br from-[#0b2a2c] via-[#08201f] to-[#041514] p-6 md:p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Still curious?</p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug text-white">
              Talk to the team directly.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={`mailto:${company.email}`}
                className={`inline-flex min-h-11 items-center justify-between gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08201f]`}
              >
                <span className="truncate">{company.email}</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center justify-between gap-3 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08201f]"
              >
                <span>{company.phone}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: accordion */}
        <ul onKeyDown={onKeyDown} className="space-y-3 md:space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${uid}-q-${i}`;
            const panelId = `${uid}-a-${i}`;
            return (
              <li
                key={item.q}
                style={{ "--d": `${0.12 + i * 0.07}s` } as CSSProperties}
                className={`faq-reveal relative overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300 ${
                  isOpen
                    ? "border-teal-deep/40 shadow-[0_24px_44px_-28px_rgba(15,60,60,0.35)]"
                    : "border-line hover:border-teal-deep/30"
                }`}
              >
                {/* Accent bar */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-0 top-0 h-full w-1 origin-top bg-gradient-to-b from-teal to-sky-400 transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
                    isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                <h3>
                  <button
                    ref={(n) => {
                      buttons.current[i] = n;
                    }}
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-14 w-full items-center gap-4 rounded-2xl px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-deep md:px-7 md:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className={`w-8 shrink-0 font-display text-sm font-semibold tabular-nums transition-colors duration-300 ${
                        isOpen ? "text-teal-deep" : "text-ink-soft"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-display text-lg leading-snug transition-colors duration-300 md:text-xl ${
                        isOpen ? "text-teal-deep" : "text-ink group-hover:text-teal-deep"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? "border-teal-deep bg-teal-deep text-white"
                          : "border-line text-ink-soft group-hover:border-teal-deep group-hover:text-teal-deep"
                      }`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded bg-current" />
                      <span
                        className={`absolute h-3.5 w-0.5 rounded bg-current transition-[transform,opacity] duration-300 ${
                          isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  data-open={isOpen}
                  className="faq-panel"
                >
                  <div className="faq-inner">
                    <p className="faq-answer pb-6 pl-[4.25rem] pr-5 text-base leading-relaxed text-ink-soft md:pb-7 md:pl-[4.75rem] md:pr-14">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}