"use client";
// components/home-components/testimonials.tsx
// Tailwind for layout/colour; a small <style> block holds only keyframes.

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
          className={`fill-[#ffc247] ${animate ? "tm-star" : ""}`}
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
  "translate3d(0,26px,-40px) scale(.95)",
  "translate3d(0,48px,-80px) scale(.9)",
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
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
  const rise = (d: number) => ({
    transitionDelay: `${d}ms`,
  });
  const show = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="tm-root relative isolate overflow-hidden bg-[#08131f] px-5 py-20 text-[#eef3f8] sm:px-10 md:py-28 lg:px-16"
    >
      <style>{keyframes}</style>

      {/* Atmosphere: fine grid fading out + two soft glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_40%,#000,transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[20%] -z-10 aspect-square w-[55%] bg-[radial-gradient(closest-side,rgba(255,194,71,.13),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[30%] -left-[15%] -z-10 aspect-square w-[50%] bg-[radial-gradient(closest-side,rgba(59,111,216,.16),transparent)]" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.25fr)] lg:gap-20">
        {/* ── Left: summary ── */}
        <div className={`transition-all duration-700 ease-out ${show}`}>
          <h2 className="max-w-[13ch] text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Don&apos;t take our word for it.
          </h2>

          <div className="mt-8 flex items-center gap-5">
            <span className="bg-gradient-to-b from-white to-[#ffc247] bg-clip-text text-7xl font-semibold leading-none tracking-tighter text-transparent">
              5.0
            </span>
            <div className="flex flex-col gap-1.5">
              <Stars animate={visible} size={20} />
              <span className="text-sm text-[#9fb1c4]">Rated by {count} clients on Google</span>
            </div>
          </div>

          <ul className="mt-9 space-y-3.5" aria-label="What reviewers mention most">
            {THEMES.map((t, i) => (
              <li key={t.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{t.label}</span>
                  <span className="tabular-nums text-[#9fb1c4]">{t.n} of {count} reviews</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffc247] to-[#ffdf91] transition-[width] duration-1000 ease-out"
                    style={{ width: visible ? `${(t.n / count) * 100}%` : "0%", transitionDelay: `${300 + i * 150}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Reviewer picker + controls */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
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
                    className={`h-11 w-11 flex-none overflow-hidden rounded-full bg-white p-0 ring-2 transition duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc247] ${
                      active ? "-translate-y-1.5 scale-110 ring-[#ffc247]" : "ring-[#08131f] grayscale-[.55] hover:grayscale-0"
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
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition duration-300 hover:border-[#ffc247] hover:text-[#ffc247] focus-visible:outline-2 focus-visible:outline-[#ffc247] active:scale-95"
              >
                <Arrow d="M15 5l-7 7 7 7" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="relative grid h-12 w-12 place-items-center rounded-full bg-[#ffc247] text-[#1a1200] transition duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc247] active:scale-95"
              >
                {/* Autoplay countdown ring */}
                <svg viewBox="0 0 52 52" className="pointer-events-none absolute -inset-[5px] h-[calc(100%+10px)] w-[calc(100%+10px)] -rotate-90" aria-hidden="true">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                  <circle
                    key={index}
                    cx="26" cy="26" r="24" fill="none" stroke="#ffc247" strokeWidth="2" strokeLinecap="round"
                    strokeDasharray="151" strokeDashoffset="151"
                    className={canAutoplay ? "tm-ring" : ""}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                    onAnimationEnd={next}
                  />
                </svg>
                <Arrow d="M9 5l7 7-7 7" />
              </button>
              <span className="ml-2 text-sm tabular-nums text-[#9fb1c4]" aria-hidden="true">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: 3D card deck ── */}
        <div
          tabIndex={0}
          aria-live="polite"
          onKeyDown={onKey}
          onPointerEnter={() => setPaused(true)}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (startX.current = null)}
          style={rise(150)}
          className={`touch-pan-y select-none pb-14 outline-offset-8 transition-all duration-1000 ease-out focus-visible:outline-2 focus-visible:outline-[#ffc247] ${show}`}
        >
          <div
            ref={deckRef}
            className="grid [transform-style:preserve-3d] [transition:transform_.35s_ease-out]"
            style={{ transform: "perspective(1400px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))" }}
          >
            {REVIEWS.map((r, i) => {
              const off = (i - index + count) % count;
              const front = off === 0;
              return (
                <article
                  key={r.name}
                  aria-hidden={!front}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  style={{
                    gridArea: "1 / 1",
                    transform: POSE[off] ?? "translate3d(0,0,-120px) scale(.86)",
                    opacity: off < 3 ? 1 - off * 0.32 : 0,
                    zIndex: count - off,
                    pointerEvents: front ? "auto" : "none",
                  }}
                  className={`relative flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] border p-7 transition-all duration-700 [transition-timing-function:cubic-bezier(.22,.8,.2,1)] sm:p-10 ${
                    front
                      ? "border-[#ffc247]/25 bg-[#10243a] shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
                      : "border-white/10 bg-[#0d1f33]"
                  }`}
                >
                  {/* cursor spotlight, front card only */}
                  {front && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 [background:radial-gradient(420px_circle_at_var(--mx,70%)_var(--my,0%),rgba(255,194,71,.13),transparent_60%)]"
                    />
                  )}
                  <svg viewBox="0 0 64 48" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-1 w-28 fill-[#ffc247] opacity-[.07]">
                    <path d="M0 48V28C0 12 9 2 26 0v10C17 12 14 17 14 24h12v24H0zm38 0V28C38 12 47 2 64 0v10c-9 2-12 7-12 14h12v24H38z" />
                  </svg>

                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <Stars />
                  </div>

                  <blockquote className="relative max-w-[60ch] text-lg font-light leading-[1.6] tracking-[-0.005em] sm:text-xl md:text-[1.4rem]">
                    {r.quote.split(" ").map((w, k) => (
                      <span
                        key={`${k}-${front ? "f" : "b"}`}
                        className={`inline-block whitespace-pre ${front ? "tm-word" : ""}`}
                        style={{ animationDelay: `${120 + Math.min(k, 60) * 14}ms` }}
                      >
                        {w}{" "}
                      </span>
                    ))}
                  </blockquote>

                  <div className="relative flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3.5">
                      <span
                        className="h-12 w-12 flex-none overflow-hidden rounded-full bg-white"
                        style={{ boxShadow: `0 0 0 3px #10243a, 0 0 0 4px ${r.color}99` }}
                      >
                        <Avatar name={r.name} size={48} hue={r.hue} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <strong className="font-semibold">{r.name}</strong>
                      </span>
                    </div>
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

const keyframes = `
.tm-word{animation:tm-w .55s cubic-bezier(.2,.8,.2,1) both}
.tm-star{animation:tm-s .5s cubic-bezier(.2,.8,.2,1) both}
.tm-ring{animation-name:tm-r;animation-timing-function:linear;animation-fill-mode:forwards}
@keyframes tm-w{from{opacity:0;transform:translateY(.5em);filter:blur(5px)}to{opacity:1;transform:none;filter:none}}
@keyframes tm-s{from{opacity:0;transform:scale(.3) rotate(-30deg)}to{opacity:1;transform:none}}
@keyframes tm-r{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.tm-root *{animation:none!important;transition:none!important}}
`;