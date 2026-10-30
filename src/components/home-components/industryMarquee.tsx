"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { clients, sectors, type Client } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Tuning                                                              */
/* ------------------------------------------------------------------ */
/** Narrowest tile (w-48 = 192px) + gap (20px). Used to size each repeated set. */
const TILE_PX = 212;
/** Each set must be at least this wide so two sets always cover the viewport. */
const MIN_SET_PX = 2000;

/* ------------------------------------------------------------------ */
/*  Styles: animation runs on the compositor (transform only), no JS     */
/*  per frame. Written as raw CSS so quotes and selectors stay intact.   */
/* ------------------------------------------------------------------ */
const CSS = `
.tm-glow{
  background:
    radial-gradient(40rem 16rem at 0% 0%, rgba(20,184,166,.10), transparent 70%),
    radial-gradient(40rem 16rem at 100% 100%, rgba(56,189,248,.10), transparent 70%);
}
.tm-viewport{
  overflow:hidden;
  contain:layout paint;
  -webkit-mask-image:linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
  mask-image:linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
}
.tm-track{
  display:flex;
  width:max-content;
  padding:1rem 0;
  will-change:transform;
  animation:tm-scroll var(--tm-dur,40s) linear infinite;
}
.tm-track[data-dir="reverse"]{animation-direction:reverse}
.tm-set{display:flex;gap:1.25rem;padding-right:1.25rem;margin:0;padding-left:0;list-style:none}
@keyframes tm-scroll{
  from{transform:translate3d(0,0,0)}
  to{transform:translate3d(-50%,0,0)}
}

/* Pause: user button, keyboard focus, hover (pointer devices only), off-screen */
.tm-marquee[data-paused="true"] .tm-track,
.tm-marquee[data-inview="false"] .tm-track,
.tm-rows:focus-within .tm-track{animation-play-state:paused}
@media (hover:hover){
  .tm-rows:hover .tm-track{animation-play-state:paused}
}

/* Entrance reveal (opacity and transform only) */
.tm-reveal{
  opacity:0;
  transform:translate3d(0,16px,0);
  transition:opacity .7s cubic-bezier(.22,1,.36,1) var(--d,0s), transform .7s cubic-bezier(.22,1,.36,1) var(--d,0s);
}
.tm-marquee[data-revealed="true"] .tm-reveal{opacity:1;transform:none}

/* Reduced motion: no movement at all. Show one static, wrapped set of logos. */
@media (prefers-reduced-motion:reduce){
  .tm-reveal{opacity:1;transform:none;transition:none}
  .tm-viewport{-webkit-mask-image:none;mask-image:none}
  .tm-track{animation:none;width:100%;will-change:auto;padding:.5rem 0}
  .tm-set{flex-wrap:wrap;justify-content:center;padding-right:0;width:100%}
  .tm-set:not(:first-child){display:none}
  .tm-dup{display:none}
}
`;

/** "Feijoa Skin & Hair Clinic" -> "FS" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function IconArrow({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function IconPause({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  One logo tile                                                       */
/* ------------------------------------------------------------------ */
function LogoTile({ client, interactive }: { client: Client; interactive: boolean }) {
  const [failed, setFailed] = useState(false);
  const showLogo = Boolean(client.logo) && !failed;
  const hasLink = Boolean(client.website);
  const ref = useRef<HTMLElement | null>(null);

  // Cursor spotlight: mouse only, updates two CSS variables on the hovered tile.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(180px_circle_at_var(--mx,50%)_var(--my,50%),rgba(20,184,166,0.18),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex h-full w-full items-center justify-center transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2.5 group-focus-visible:-translate-y-2.5">
        {showLogo ? (
          <div className="relative h-full w-full">
            <Image
              src={client.logo as string}
              // The link already has an accessible name, so the image is decorative inside it.
              alt={hasLink ? "" : `${client.name} logo`}
              fill
              sizes="(min-width: 768px) 176px, 144px"
              loading="eager"
              fetchPriority="low"
              draggable={false}
              onError={() => setFailed(true)}
              className="select-none object-contain py-1 opacity-70 grayscale transition-[filter,opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
            />
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3 opacity-80 grayscale transition-[filter,opacity] duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-teal-deep to-teal font-display text-base font-semibold tracking-wide text-white"
            >
              {initials(client.name)}
            </span>
            <span className="line-clamp-2 text-sm font-semibold leading-tight text-ink">{client.name}</span>
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-2.5 flex translate-y-2 items-center justify-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-teal-deep opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {client.sector}
        {hasLink && <IconArrow className="h-3 w-3 -rotate-45" />}
      </span>
    </>
  );

  const base =
    "group relative block h-24 w-48 shrink-0 overflow-hidden rounded-2xl border border-line bg-white px-6 py-5 transition-[transform,border-color,box-shadow] duration-500 motion-safe:hover:-translate-y-1.5 hover:border-teal-deep/40 hover:shadow-[0_22px_40px_-22px_rgba(15,60,60,0.35)] md:h-28 md:w-56";

  if (hasLink) {
    return (
      <a
        ref={(n) => {
          ref.current = n;
        }}
        href={client.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${client.name}, ${client.sector}, opens in a new tab`}
        tabIndex={interactive ? 0 : -1}
        onPointerMove={onPointerMove}
        className={`${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      ref={(n) => {
        ref.current = n;
      }}
      onPointerMove={onPointerMove}
      className={base}
    >
      {inner}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee row. Only the first set of the first row is exposed to       */
/*  assistive tech; every repeat is hidden so nothing is announced twice */
/* ------------------------------------------------------------------ */
function MarqueeRow({
  items,
  reverse = false,
  secPerTile,
  accessible,
}: {
  items: Client[];
  reverse?: boolean;
  secPerTile: number;
  accessible: boolean;
}) {
  const reps = Math.max(1, Math.ceil(MIN_SET_PX / (items.length * TILE_PX)));
  const perSet = items.length * reps;

  // If keyboard focus scrolled the clipped viewport, reset it when focus leaves.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      e.currentTarget.scrollLeft = 0;
    }
  };

  return (
    <div
      className={`tm-viewport ${accessible ? "" : "tm-dup"}`}
      aria-hidden={accessible ? undefined : true}
      onBlur={onBlur}
    >
      <div
        className="tm-track"
        data-dir={reverse ? "reverse" : undefined}
        style={{ "--tm-dur": `${perSet * secPerTile}s` } as CSSProperties}
      >
        {[0, 1].map((set) => (
          <ul
            key={set}
            role="list"
            aria-label={accessible && set === 0 ? "Our clients" : undefined}
            aria-hidden={!accessible || set > 0 ? true : undefined}
            className="tm-set"
          >
            {Array.from({ length: reps }).flatMap((_, rep) =>
              items.map((client) => {
                const dup = set > 0 || rep > 0;
                return (
                  <li
                    key={`${client.slug}-${rep}`}
                    aria-hidden={dup ? true : undefined}
                    className={dup ? "tm-dup shrink-0" : "shrink-0"}
                  >
                    <LogoTile client={client} interactive={accessible && !dup} />
                  </li>
                );
              })
            )}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */
export default function IndustryMarquee() {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  const activeCount = useMemo(() => clients.filter((c) => c.ongoing).length, []);

  // Second row: different order so the two rows never line up.
  const rowTwo = useMemo(() => {
    const shift = Math.ceil(clients.length / 2);
    return [...clients.slice(shift), ...clients.slice(0, shift)].reverse();
  }, []);

  // One observer pauses the animation while off-screen, another triggers the entrance once.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }
    const visibility = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inview = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "100px 0px" }
    );
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = "true";
          reveal.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    visibility.observe(el);
    reveal.observe(el);
    return () => {
      visibility.disconnect();
      reveal.disconnect();
    };
  }, []);

  if (clients.length === 0) return null;

  const stats = [
    { value: clients.length, label: "Brands" },
    { value: sectors.length, label: "Industries" },
    { value: activeCount, label: "Active partnerships" },
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-paused={paused}
      className="tm-marquee relative overflow-hidden border-y border-line bg-paper-raised py-14 md:py-16"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="tm-glow pointer-events-none absolute inset-0" />

      {/* Header */}
      <div className="wrap relative">
        <div className="tm-reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal/60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              Trusted by
            </p>
            <h2 id={headingId} className="mt-3 font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
              Brands that grow with us
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ul className="flex flex-wrap gap-3" aria-label="At a glance">
              {stats.map((s) => (
                <li
                  key={s.label}
                  className="flex items-baseline gap-2 rounded-full border border-line bg-white px-4 py-2"
                >
                  <span className="font-display text-lg font-semibold tabular-nums text-ink">{s.value}</span>
                  <span className="text-xs font-medium text-ink-soft">{s.label}</span>
                </li>
              ))}
            </ul>

            {/* WCAG 2.2.2: moving content needs a way to pause it */}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="tm-dup inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-teal-deep hover:text-teal-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {paused ? <IconPlay className="h-4 w-4" /> : <IconPause className="h-4 w-4" />}
              <span>
                {paused ? "Play" : "Pause"}
                <span className="sr-only"> scrolling client logos</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="tm-rows tm-reveal relative mt-6 space-y-1 md:mt-8" style={{ "--d": "0.15s" } as CSSProperties}>
        <MarqueeRow items={clients} secPerTile={5.5} accessible />
        <MarqueeRow items={rowTwo} reverse secPerTile={7} accessible={false} />
      </div>
    </section>
  );
}