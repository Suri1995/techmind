"use client";
// components/home-components/testimonials.tsx
// Tailwind for layout/colour; a small <style> block holds keyframes and the few effects Tailwind can't express.
// Light surfaces only (paper, white, mist, teal and amber tints); every text colour is a dark ink.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const AUTOPLAY_MS = 8000;

type Review = { name: string; color: string; hue: number; quote: string };

const REVIEWS: Review[] = [
  {
    name: "Ajay Raj",
    color: "#2fb36d", hue: -70,
    quote:
      "We are Brand Market Research Bureau and had a great experience working with Tech Mind Digital Marketing Agency. They are very very professional, responsive, and genuinely understood what we needed for our marketing and the team communicated clearly throughout and delivered good results. All the best to the entire team.",
  },
  {
    name: "Vamshi Krishna Naraboina",
    color: "#8b5cf6", hue: 55,
    quote:
      "Great experience with Techmind. We brought on board specifically to fix our lead generation, and they delivered quick on updates. Our lead volume has increased consistently since they took over our campaigns. Responsive team and very reliable to work with.",
  },
  {
    name: "Srigdha Groups",
    color: "#f97316", hue: 175,
    quote:
      "Genuine and hassle free service. They knew how to generate leads by accurate targeting taking the proper inputs. Really happy with your agency generating revenue in very less time.",
  },
  {
    name: "Sushanth Reddy",
    color: "#ec4899", hue: 115,
    quote:
      "I came to know about Tech Mind Digital Marketing Agency through a friend whose company was using their services. I've seen how their team worked closely with the business and helped develop a consistent lead flow through digital marketing. They were professional, responsive, and took the time to understand the business rather than following a generic approach. I'd definitely recommend Tech Mind to businesses looking for reliable digital marketing and lead generation support.",
  },
  {
    name: "Ram Jagarapu",
    color: "#14b8a6", hue: -35,
    quote:
      "I had a good experience working with Tech Mind Digital Marketing Agency. The team was responsive and professional, and they understood our requirements well. Overall, a good experience working with them.",
  },
];

// How many of the 5 reviews mention each theme
const THEMES = [
  { label: "Responsive team", n: 4 },
  { label: "Lead generation", n: 3 },
  { label: "Professional", n: 3 },
];

// Shared avatar image: save the icon as /public/avatar-icon.png
// `hue` rotates the blue icon so each reviewer gets their own colour (white body is unaffected)
function Avatar({ name, size, hue }: { name: string; size: number; hue: number }) {
  return (
    <Image
      src="/avatar-icon.png"
      alt={`${name}, Google reviewer`}
      width={size * 2}
      height={size * 2}
      className="h-full w-full rounded-full object-cover"
      draggable={false}
      style={{ filter: `hue-rotate(${hue}deg)` }}
    />
  );
}

function GoogleG({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function Stars({ animate = false, size = 18 }: { animate?: boolean; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={size}
          height={size}
          aria-hidden="true"
          className={`fill-[#f5a524] drop-shadow-[0_1px_1px_rgba(232,162,58,.35)] ${animate ? "tm-star" : ""}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1 4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

// Position of each card in the deck: front, two peeking behind, rest tucked away
const POSE = [
  "translate3d(0,0,0) scale(1)",
  "translate3d(0,28px,-40px) scale(.95)",
  "translate3d(0,54px,-80px) scale(.9)",
];
// The card that just left the front lifts away to the left before settling at the back
const LEAVING = "translate3d(-7%,-14px,30px) rotate(-3deg) scale(1.02)";
const TUCKED = "translate3d(0,0,-120px) scale(.86)";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const ratingDone = useRef(false);
  const count = REVIEWS.length;

  const go = useCallback((to: number) => setIndex(((to % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    setCanAutoplay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The 5.0 rating counts up once, the first time the section is on screen.
  useEffect(() => {
    if (!visible || ratingDone.current) return;
    if (!canAutoplay) {
      ratingDone.current = true;
      setRating(5);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setRating(5 * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else ratingDone.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, canAutoplay]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
  };

  // Mouse: 3D tilt + spotlight (CSS variables, no re-render). Touch/mouse: swipe.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = deckRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width;
    const y = (e.clientY - b.top) / b.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = deckRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setPaused(false);
  };
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  const playing = canAutoplay && visible && !paused;
  const show = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="tm-root relative isolate overflow-hidden bg-gradient-to-b from-paper via-white to-paper px-5 py-24 text-ink sm:px-10 md:py-32 lg:px-16"
    >
      <style>{css}</style>

      {/* Light atmosphere: fine dot grid fading out, two drifting tints, a soft hairline at the top */}
      <div aria-hidden="true" className="tm-dots pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="tm-orb pointer-events-none absolute -right-[8%] -top-[18%] -z-10 aspect-square w-[46%] bg-[radial-gradient(closest-side,rgba(232,162,58,.24),transparent)]" />
      <div aria-hidden="true" className="tm-orb pointer-events-none absolute -bottom-[26%] -left-[12%] -z-10 aspect-square w-[44%] bg-[radial-gradient(closest-side,rgba(20,184,166,.22),transparent)] [animation-delay:-8s]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-teal-deep/25 to-transparent" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.25fr)] lg:gap-24">
        {/* ── Left: summary ── */}
        <div className={`transition-all duration-700 ease-out ${show}`}>
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-teal-deep/20 bg-white/80 py-1.5 pl-3 pr-4 text-sm font-semibold text-ink shadow-[0_8px_20px_-12px_rgba(11,122,114,.45)] backdrop-blur">
            <span aria-hidden="true" className="tm-live" />
            Client Reviews
          </p>
          <h2 className="max-w-[12ch] font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl lg:text-[4.1rem]">
            Don&apos;t take our word for it.
          </h2>

          {/* Rating */}
          <div className="mt-10 flex items-center gap-6">
            <span className="bg-gradient-to-b from-ink via-ink to-teal-deep bg-clip-text font-display text-[5.5rem] font-semibold leading-none tracking-tighter tabular-nums text-transparent md:text-[6.5rem]">
              {rating.toFixed(1)}
            </span>
            <div className="flex flex-col gap-2 border-l border-line pl-6">
              <Stars animate={visible} size={22} />
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
                <GoogleG size={15} />
                Rated by {count} clients on Google
              </span>
            </div>
          </div>

          {/* Themes */}
          <ul className="mt-10 space-y-5" aria-label="What reviewers mention most">
            {THEMES.map((t, i) => (
              <li key={t.label}>
                <div className="mb-2 flex justify-between text-sm font-semibold text-ink">
                  <span>{t.label}</span>
                  <span className="tabular-nums font-medium text-ink-soft">{t.n} of {count} reviews</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line/80 shadow-[inset_0_1px_2px_rgba(6,31,34,.08)]">
                  <div
                    className="tm-bar relative h-full rounded-full bg-gradient-to-r from-teal via-aqua to-amber transition-[width] duration-1000 ease-out"
                    style={{ width: visible ? `${(t.n / count) * 100}%` : "0%", transitionDelay: `${300 + i * 150}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Reviewer picker + controls */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
            <div role="tablist" aria-label="Choose a reviewer" onKeyDown={onKey} className="flex -space-x-3">
              {REVIEWS.map((v, i) => {
                const active = i === index;
                return (
                  <button
                    key={v.name}
                    role="tab"
                    aria-selected={active}
                    aria-label={v.name}
                    tabIndex={active ? 0 : -1}
                    onClick={() => go(i)}
                    style={{ zIndex: active ? 10 : count - i }}
                    className={`h-11 w-11 flex-none overflow-hidden rounded-full bg-white p-0 ring-2 shadow-[0_8px_16px_-6px_rgba(6,31,34,.4)] transition duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep ${
                      active ? "-translate-y-1.5 scale-110 ring-teal-deep" : "ring-white grayscale-[.5] hover:grayscale-0"
                    }`}
                  >
                    <Avatar name={v.name} size={44} hue={v.hue} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink shadow-[0_1px_2px_rgba(6,31,34,.05),0_10px_20px_-12px_rgba(6,31,34,.25)] transition duration-300 hover:-translate-x-0.5 hover:border-teal-deep hover:bg-teal-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep active:scale-95"
              >
                <Arrow d="M15 5l-7 7 7 7" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="relative grid h-12 w-12 place-items-center rounded-full border border-amber/50 bg-[#fdebc8] text-ink shadow-[0_12px_22px_-12px_rgba(232,162,58,.9)] transition duration-300 hover:scale-105 hover:bg-[#fbe0a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep active:scale-95"
              >
                {/* Autoplay countdown ring */}
                <svg viewBox="0 0 52 52" className="pointer-events-none absolute -inset-[5px] h-[calc(100%+10px)] w-[calc(100%+10px)] -rotate-90" aria-hidden="true">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(6,31,34,.10)" strokeWidth="2" />
                  <circle
                    key={index}
                    cx="26" cy="26" r="24" fill="none" stroke="#0b7a72" strokeWidth="2" strokeLinecap="round"
                    strokeDasharray="151" strokeDashoffset="151"
                    className={canAutoplay ? "tm-ring" : ""}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                    onAnimationEnd={next}
                  />
                </svg>
                <Arrow d="M9 5l7 7-7 7" />
              </button>
              <span className="ml-2 text-sm font-semibold tabular-nums text-ink-soft" aria-hidden="true">
                {index + 1} of {count}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: 3D card deck ── */}
        <div
          tabIndex={0}
          aria-live={playing ? "off" : "polite"}
          onKeyDown={onKey}
          onPointerEnter={() => setPaused(true)}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (startX.current = null)}
          style={{ transitionDelay: "150ms" }}
          className={`relative touch-pan-y select-none pb-16 outline-offset-8 transition-all duration-1000 ease-out focus-visible:outline-2 focus-visible:outline-teal-deep ${show}`}
        >
          {/* Soft glow beneath the deck so it feels lifted off the page */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] bottom-4 -z-10 h-24 rounded-full bg-[radial-gradient(closest-side,rgba(11,122,114,.28),transparent)] blur-2xl"
          />

          <div
            ref={deckRef}
            className="grid [transform-style:preserve-3d] [transition:transform_.35s_ease-out]"
            style={{ transform: "perspective(1400px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))" }}
          >
            {REVIEWS.map((r, i) => {
              const off = (i - index + count) % count;
              const front = off === 0;
              const leaving = off === count - 1 && count > 3;
              const transform = POSE[off] ?? (leaving ? LEAVING : TUCKED);
              return (
                <article
                  key={r.name}
                  aria-hidden={!front}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  style={{
                    gridArea: "1 / 1",
                    transform,
                    opacity: off < 3 ? 1 - off * 0.28 : 0,
                    zIndex: count - off,
                    pointerEvents: front ? "auto" : "none",
                  }}
                  className={`relative flex flex-col justify-between gap-9 overflow-hidden rounded-[32px] p-7 transition-all duration-700 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] sm:p-11 ${
                    front
                      ? "tm-front shadow-[0_50px_90px_-40px_rgba(11,122,114,.55),0_18px_30px_-24px_rgba(6,31,34,.25),0_2px_4px_rgba(6,31,34,.04)]"
                      : "border border-line bg-[#eef7f5] shadow-[0_24px_40px_-30px_rgba(6,31,34,.3)]"
                  }`}
                >
                  {/* soft top wash + cursor spotlight, front card only */}
                  {front && (
                    <>
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-teal-tint/80 to-transparent" />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 [background:radial-gradient(440px_circle_at_var(--mx,70%)_var(--my,0%),rgba(232,162,58,.16),transparent_60%)]"
                      />
                    </>
                  )}

                  {/* oversized quotation mark, gradient-filled */}
                  <svg viewBox="0 0 64 48" aria-hidden="true" className="pointer-events-none absolute -right-1 -top-1 w-32 opacity-[.14]">
                    <defs>
                      <linearGradient id={`tm-q-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#0b7a72" />
                        <stop offset="1" stopColor="#e8a23a" />
                      </linearGradient>
                    </defs>
                    <path fill={`url(#tm-q-${i})`} d="M0 48V28C0 12 9 2 26 0v10C17 12 14 17 14 24h12v24H0zm38 0V28C38 12 47 2 64 0v10c-9 2-12 7-12 14h12v24H38z" />
                  </svg>

                  <div className="relative flex flex-wrap items-center justify-between gap-3 pr-16 sm:pr-24">
                    <Stars size={20} />
                    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-[0_4px_10px_-6px_rgba(6,31,34,.3)]">
                      <GoogleG size={14} />
                      Google review
                    </span>
                  </div>

                  <blockquote className="relative max-w-[58ch] text-[1.08rem] font-medium leading-[1.7] tracking-[-0.008em] text-ink sm:text-xl md:text-[1.32rem]">
                    {r.quote.split(" ").map((w, k) => (
                      <span
                        key={`${k}-${front ? "f" : "b"}`}
                        className={`inline-block whitespace-pre ${front ? "tm-word" : ""}`}
                        style={{ animationDelay: `${140 + Math.min(k, 60) * 14}ms` }}
                      >
                        {w}{" "}
                      </span>
                    ))}
                  </blockquote>

                  <div className="relative flex items-center gap-4 border-t border-line pt-6">
                    <span
                      className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-white"
                      style={{ boxShadow: `0 0 0 3px #ffffff, 0 0 0 5px ${r.color}, 0 10px 18px -8px ${r.color}` }}
                    >
                      <Avatar name={r.name} size={56} hue={r.hue} />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <strong className="truncate text-base font-semibold text-ink sm:text-lg">{r.name}</strong>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#0b7a72" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 10.5l4 4 8-9" />
                        </svg>
                        Verified client
                      </span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const css = `
.tm-dots{
  background-image:radial-gradient(rgba(6,31,34,.10) 1px, transparent 1px);
  background-size:22px 22px;
  -webkit-mask-image:radial-gradient(ellipse at 70% 40%, #000, transparent 70%);
  mask-image:radial-gradient(ellipse at 70% 40%, #000, transparent 70%);
}
.tm-orb{animation:tm-float 24s ease-in-out infinite;will-change:transform}
.tm-word{animation:tm-w .55s cubic-bezier(.2,.8,.2,1) both}
.tm-star{animation:tm-s .5s cubic-bezier(.2,.8,.2,1) both}
.tm-ring{animation-name:tm-r;animation-timing-function:linear;animation-fill-mode:forwards}

/* Front card: white face with a teal-to-amber hairline border */
.tm-front{
  border:1px solid transparent;
  background:
    linear-gradient(#ffffff,#ffffff) padding-box,
    linear-gradient(140deg, rgba(11,122,114,.65), rgba(232,162,58,.55) 55%, rgba(11,122,114,.18)) border-box;
}
/* One soft sheen sweeps across the card each time it comes to the front */
.tm-front::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(105deg, transparent 38%, rgba(255,255,255,.85) 50%, transparent 62%);
  transform:translateX(-120%);
  animation:tm-sheen 1.2s .1s cubic-bezier(.22,.8,.2,1) 1 forwards;
}

/* Live dot beside the "Client Reviews" pill */
.tm-live{position:relative;display:inline-block;width:8px;height:8px;border-radius:9999px;background:#0b7a72}
.tm-live::after{content:"";position:absolute;inset:0;border-radius:9999px;background:#0b7a72;animation:tm-pulse 2.2s ease-out infinite}

/* Glint travelling along the theme bars */
.tm-bar::after{
  content:"";position:absolute;inset:0;border-radius:inherit;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  transform:translateX(-100%);animation:tm-glint 3.6s ease-in-out 1.6s infinite;
}

@keyframes tm-float{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(24px,-20px,0) scale(1.06)}}
@keyframes tm-w{from{opacity:0;transform:translateY(.5em);filter:blur(5px)}to{opacity:1;transform:none;filter:none}}
@keyframes tm-s{from{opacity:0;transform:scale(.3) rotate(-30deg)}to{opacity:1;transform:none}}
@keyframes tm-r{to{stroke-dashoffset:0}}
@keyframes tm-sheen{to{transform:translateX(120%)}}
@keyframes tm-pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(3);opacity:0}}
@keyframes tm-glint{0%{transform:translateX(-100%)}60%,100%{transform:translateX(100%)}}
@media (prefers-reduced-motion:reduce){.tm-root *,.tm-root *::after{animation:none!important;transition:none!important}}
`;