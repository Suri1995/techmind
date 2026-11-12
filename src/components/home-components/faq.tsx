"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { company, faqs } from "@/lib/data";

type Props = {
  items?: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  description?: string;
  id?: string;
};

/* Design notes
   - Light surfaces only (white, mist, teal-tint, soft amber wash). Every text colour is a dark ink.
   - One orchestrated entrance when the section first scrolls into view, then motion only answers the
     person's actions: opening a question or hovering the contact card.
   - The answer panel animates grid-template-rows (0fr to 1fr): no height measuring. Closed panels use
     visibility:hidden so their content leaves the tab order and screen readers after the transition.
   - The left column is sticky: the section uses overflow-clip (not overflow-hidden, which would break sticky).
   - Everything is CSS driven; JS only toggles state and sets two custom properties for the cursor glow. */
const CSS = `
@property --faq-angle{syntax:"<angle>";inherits:false;initial-value:0deg}

.faq-aura{
  background:
    radial-gradient(46rem 22rem at 0% 0%, rgba(20,184,166,.12), transparent 70%),
    radial-gradient(34rem 18rem at 100% 100%, rgba(232,162,58,.10), transparent 70%),
    radial-gradient(28rem 16rem at 100% 0%, rgba(56,189,248,.08), transparent 70%);
}
.faq-dots{
  background-image:radial-gradient(rgba(6,31,34,.07) 1px, transparent 1px);
  background-size:22px 22px;
  -webkit-mask-image:radial-gradient(ellipse 70% 60% at 30% 20%, #000 20%, transparent 75%);
  mask-image:radial-gradient(ellipse 70% 60% at 30% 20%, #000 20%, transparent 75%);
}
.faq-orb{
  position:absolute;border-radius:9999px;filter:blur(64px);pointer-events:none;
  animation:faq-float 22s ease-in-out infinite;will-change:transform;
}
@keyframes faq-float{
  0%,100%{transform:translate3d(0,0,0) scale(1)}
  50%{transform:translate3d(26px,-22px,0) scale(1.07)}
}

/* One entrance sequence for the whole section */
.faq-in{
  opacity:0;
  transform:translate3d(0,18px,0);
  transition:opacity .75s ease var(--d,0s), transform .9s cubic-bezier(.22,1,.36,1) var(--d,0s);
}
.faq[data-revealed="true"] .faq-in{opacity:1;transform:none}

/* Title underline draws once */
.faq-draw{
  display:block;height:3px;width:4.5rem;margin-top:1.25rem;border-radius:9999px;
  background:linear-gradient(90deg,#14b8a6,#e8a23a);
  transform:scaleX(0);transform-origin:left;
  transition:transform 1s cubic-bezier(.22,1,.36,1) .5s;
}
.faq[data-revealed="true"] .faq-draw{transform:scaleX(1)}

/* Contact card: light surface with a slowly travelling gradient edge */
.faq-card{
  position:relative;border-radius:1.75rem;
  background:linear-gradient(150deg,#ffffff 0%,#effaf7 58%,#fff6e4 100%);
  box-shadow:0 1px 2px rgba(6,31,34,.05),0 28px 50px -30px rgba(11,122,114,.35);
}
.faq-card::before{
  content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;
  background:conic-gradient(from var(--faq-angle),rgba(20,184,166,0),rgba(20,184,166,.75),rgba(232,162,58,.7),rgba(20,184,166,0) 70%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
  animation:faq-spin 7s linear infinite;pointer-events:none;
}
@keyframes faq-spin{to{--faq-angle:360deg}}

.faq-live{position:relative;display:inline-block;height:.5rem;width:.5rem;border-radius:9999px;background:#14b8a6}
.faq-live::after{
  content:"";position:absolute;inset:0;border-radius:inherit;background:#14b8a6;
  animation:faq-ping 2.2s cubic-bezier(0,0,.2,1) infinite;
}
@keyframes faq-ping{0%{transform:scale(1);opacity:.7}80%,100%{transform:scale(3.2);opacity:0}}

/* Contact buttons: arrow glides, fill sweeps in from the left */
.faq-btn{position:relative;overflow:hidden;isolation:isolate}
.faq-btn::before{
  content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(90deg,rgba(20,184,166,.16),rgba(20,184,166,.04));
  transform:scaleX(0);transform-origin:left;
  transition:transform .55s cubic-bezier(.22,1,.36,1);
}
.faq-btn:hover::before,.faq-btn:focus-visible::before{transform:scaleX(1)}
.faq-btn .faq-arrow{transition:transform .4s cubic-bezier(.22,1,.36,1)}
.faq-btn:hover .faq-arrow,.faq-btn:focus-visible .faq-arrow{transform:translateX(5px)}

/* Question rows */
.faq-item{
  transition:border-color .35s ease, box-shadow .5s ease, background-color .4s ease, transform .5s cubic-bezier(.22,1,.36,1);
}
.faq-item[data-open="true"]{transform:translate3d(0,-2px,0)}
.faq-glow{
  position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .45s ease;
  background:radial-gradient(340px circle at var(--mx,50%) var(--my,0%),rgba(20,184,166,.13),transparent 70%);
}
.faq-item:hover .faq-glow,.faq-item[data-open="true"] .faq-glow{opacity:1}

/* Answer panel */
.faq-panel{
  display:grid;grid-template-rows:0fr;visibility:hidden;
  transition:grid-template-rows .5s cubic-bezier(.22,1,.36,1), visibility 0s linear .5s;
}
.faq-panel[data-open="true"]{
  grid-template-rows:1fr;visibility:visible;
  transition:grid-template-rows .5s cubic-bezier(.22,1,.36,1), visibility 0s linear 0s;
}
.faq-inner{min-height:0;overflow:hidden}
.faq-answer{
  opacity:0;transform:translate3d(0,-8px,0);filter:blur(3px);
  transition:opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1), filter .4s ease;
}
.faq-panel[data-open="true"] .faq-answer{opacity:1;transform:none;filter:none;transition-delay:.1s}

/* Open-state accent rail grows from the top */
.faq-rail{
  transform:scaleY(0);transform-origin:top;
  transition:transform .6s cubic-bezier(.22,1,.36,1);
}
.faq-item[data-open="true"] .faq-rail{transform:scaleY(1)}

@media (prefers-reduced-motion:reduce){
  .faq-in{opacity:1;transform:none;transition:none}
  .faq-draw{transform:none;transition:none}
  .faq-orb,.faq-live::after{animation:none}
  .faq-card::before{animation:none}
  .faq-btn::before,.faq-btn .faq-arrow,.faq-item,.faq-rail{transition:none}
  .faq-item[data-open="true"]{transform:none}
  .faq-panel,.faq-panel[data-open="true"]{transition:none}
  .faq-answer,.faq-panel[data-open="true"] .faq-answer{opacity:1;transform:none;filter:none;transition:none}
}
`;

function IconMail({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7.5l8 5.5 8-5.5" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function FAQ({
  items = faqs,
  eyebrow = "Questions",
  title = "Questions businesses ask before they start.",
  description = "If yours isn't here, send it over and we'll reply within one business day.",
  id,
}: Props = {}) {
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);
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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Accordion keyboard pattern: Up/Down/Home/End move focus between questions.
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const count = items.length;
    const current = buttons.current.findIndex((b) => b === e.target);
    if (current === -1 || count === 0) return;
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

  // Cursor glow: one delegated handler, mouse only.
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return;
    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-faq-item]");
    if (!row) return;
    const r = row.getBoundingClientRect();
    row.style.setProperty("--mx", `${e.clientX - r.left}px`);
    row.style.setProperty("--my", `${e.clientY - r.top}px`);
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

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={headingId}
      className="faq relative scroll-mt-32 overflow-clip border-t border-line bg-paper-raised py-16 text-ink md:py-24"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Light atmosphere */}
      <div aria-hidden="true" className="faq-aura pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="faq-dots pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="faq-orb -left-24 top-10 h-72 w-72 bg-teal/20" />
      <div aria-hidden="true" className="faq-orb -right-20 bottom-4 h-80 w-80 bg-amber/20 [animation-delay:-9s]" />

      <div className="wrap relative grid gap-12 md:grid-cols-[0.82fr_1.18fr] md:gap-14">
        {/* Left: heading + contact card (sticky on desktop) */}
        <div className="md:sticky md:top-[calc(var(--header-height,5rem)+1.5rem)] md:self-start">
          <p className="faq-in inline-flex items-center gap-2.5 rounded-full border border-teal-deep/20 bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-ink backdrop-blur">
            <span aria-hidden="true" className="faq-live" />
            {eyebrow}
          </p>
          <h2
            id={headingId}
            style={{ "--d": "0.08s" } as CSSProperties}
            className="faq-in mt-5 font-display text-3xl font-semibold leading-[1.15] text-ink md:text-[2.6rem]"
          >
            {title}
          </h2>
          <span aria-hidden="true" className="faq-draw" />
          <p
            style={{ "--d": "0.16s" } as CSSProperties}
            className="faq-in mt-5 max-w-md text-base font-medium leading-relaxed text-ink-soft"
          >
            {description}
          </p>

          <div style={{ "--d": "0.26s" } as CSSProperties} className="faq-in faq-card mt-8 p-6 md:p-7">
            <p className="flex items-center gap-2.5 text-sm font-semibold text-ink-soft">
              <span aria-hidden="true" className="faq-live" />
              Replies within one business day
            </p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug text-ink">
              Prefer to talk it through? Reach the team directly.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href={`mailto:${company.email}`}
                className="faq-btn inline-flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_1px_2px_rgba(6,31,34,0.05)] transition-colors hover:border-teal-deep/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-ink">
                  <IconMail className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate">{company.email}</span>
                <IconArrow className="faq-arrow h-4 w-4 shrink-0" />
              </a>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="faq-btn inline-flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-[#fffaf0] px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_1px_2px_rgba(6,31,34,0.05)] transition-colors hover:border-amber/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fdebc8] text-ink">
                  <IconPhone className="h-4 w-4" />
                </span>
                <span className="flex-1">{company.phone}</span>
                <IconArrow className="faq-arrow h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: accordion */}
        <ul onKeyDown={onKeyDown} onPointerMove={onPointerMove} className="space-y-3 md:space-y-4">
          {items.map((item, i) => {
            const isOpen = open === item.q;
            const buttonId = `${uid}-q-${i}`;
            const panelId = `${uid}-a-${i}`;
            return (
              <li
                key={item.q}
                data-faq-item
                data-open={isOpen}
                style={{ "--d": `${0.14 + i * 0.07}s` } as CSSProperties}
                className={`faq-in faq-item relative overflow-hidden rounded-3xl border ${
                  isOpen
                    ? "border-teal-deep/35 bg-gradient-to-br from-white via-white to-teal-tint/60 shadow-[0_30px_50px_-30px_rgba(11,122,114,0.38)]"
                    : "border-line bg-white shadow-[0_1px_2px_rgba(6,31,34,0.04)] hover:border-teal-deep/30"
                }`}
              >
                <span aria-hidden="true" className="faq-glow" />
                <span
                  aria-hidden="true"
                  className="faq-rail pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal via-aqua to-amber"
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
                    onClick={() => setOpen(isOpen ? null : item.q)}
                    className="group relative flex min-h-16 w-full items-center gap-4 rounded-3xl px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-deep md:px-7 md:py-6"
                  >
                    <span
                      className={`flex-1 font-display text-lg font-semibold leading-snug text-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] md:text-xl ${
                        isOpen ? "translate-x-1" : "group-hover:translate-x-1"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-ink transition-[background-color,border-color,transform] duration-500 ${
                        isOpen
                          ? "rotate-180 border-teal-deep/50 bg-teal-tint"
                          : "border-line bg-mist group-hover:border-teal-deep/40 group-hover:bg-teal-tint"
                      }`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded bg-current" />
                      <span
                        className={`absolute h-3.5 w-0.5 rounded bg-current transition-[transform,opacity] duration-500 ${
                          isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div id={panelId} role="region" aria-labelledby={buttonId} data-open={isOpen} className="faq-panel">
                  <div className="faq-inner">
                    <div className="faq-answer pb-6 pl-5 pr-5 md:pb-7 md:pl-8 md:pr-16">
                      <p className="text-base font-medium leading-relaxed text-ink-soft md:text-[1.0625rem]">
                        {item.a}
                      </p>
                      <a
                        href={`mailto:${company.email}?subject=${encodeURIComponent(item.q)}`}
                        className="link-underline mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Ask a follow-up about this
                      </a>
                    </div>
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