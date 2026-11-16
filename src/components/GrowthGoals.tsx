"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import LeadModal from "./LeadModal";

/**
 * GrowthGoals (light, premium carousel)
 * Drop into any page:  <GrowthGoals />
 * Suggested location:  components/GrowthGoals.tsx
 *
 * Layout: heading + subheading on top, a row of cards, then a progress bar
 * and centered controls (prev · dots · next) below the cards.
 *
 * Each card: artwork on top (2:1), tinted text area below (colour taken from the artwork).
 * Cards per view: 1 (full width) below 640px, 2 across from 640px to 1023px,
 * 3 across from 1024px up.
 * "Learn More" opens a popup with the same lead form as the hero.
 *
 * Images live directly in /public (see the `image` field of each goal below).
 * If an image is missing, the card shows its own colour gradient instead.
 *
 * Light only. No extra packages or global CSS beyond what the site already has.
 *
 * Interaction: scroll-snap swipe, prev/next buttons, mouse drag, arrow keys,
 * clickable dots, progress bar, 3D tilt + spotlight + gradient edge on hover,
 * gentle autoplay (pauses on hover/focus/touch/drag/popup, off for reduced motion).
 */

type Goal = {
  title: string;
  text: string;
  /** Artwork for the top of the card (2:1). Files live in /public. */
  image: string;
  /** Accent colours for this card (line, hover glow, arrow). */
  from: string;
  to: string;
  /** Soft background for the text area, taken from the artwork's colours. */
  bg: string;
};

const goals: Goal[] = [
  {
    title: "Branding & Identity",
    text: "Build a strong brand identity that makes your business stand out.",
    image: "/branding-identity.png",
    from: "#14b8a6",
    to: "#0b7a72",
    bg: "linear-gradient(160deg, #dcf5f1 0%, #eefaf8 45%, #fff4c9 100%)",
  },
  {
    title: "Quality Lead Generation",
    text: "Attract potential customers and generate quality business leads.",
    image: "/quality-lead-generation-strategy.png",
    from: "#2563eb",
    to: "#1d4ed8",
    bg: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 50%, #fef3c7 100%)",
  },
  {
    title: "Brand Awareness",
    text: "Increase your brand visibility and reach the right audience.",
    image: "/brand-awareness.png",
    from: "#ef4444",
    to: "#b91c1c",
    bg: "linear-gradient(160deg, #ffe4e6 0%, #fff1f2 45%, #e0f2fe 100%)",
  },
  {
    title: "Genuine Social Media Growth",
    text: "Grow your social media presence with authentic followers and engagement.",
    image: "/genuine-social-media-growth.png",
    from: "#0ea5e9",
    to: "#ec4899",
    bg: "linear-gradient(160deg, #e0f2fe 0%, #f0f9ff 50%, #fce7f3 100%)",
  },
  {
    title: "E-Commerce Sales Growth",
    text: "Drive online store traffic and turn potential buyers into customers.",
    image: "/ecommerce-growth.png",
    from: "#f59e0b",
    to: "#d97706",
    bg: "linear-gradient(160deg, #fff1cc 0%, #fffaf0 50%, #e2e8f0 100%)",
  },
];

const AUTOPLAY_MS = 5000;

/* each card sets --c1 / --c2 from its own goal colours */
const CARD_GRADIENT = "linear-gradient(135deg, var(--c1), var(--c2))";

const edgeStyle: CSSProperties = {
  padding: 1,
  background: "linear-gradient(135deg, var(--c1), var(--c2) 55%, transparent)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={dir === "left" ? "rotate-180" : ""}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function GrowthGoals() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef<number | null>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);

  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState<number[]>([0]);
  const [formOpen, setFormOpen] = useState(false);

  /* ---------- lead form popup ---------- */
  const openForm = (trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setFormOpen(true);
  };

  const closeForm = useCallback(() => {
    setFormOpen(false);
    // give focus back to the Learn More button that opened the popup
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  /* ---------- measure scroll state ---------- */
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 1);

    const box = el.getBoundingClientRect();
    const vis: number[] = [];
    Array.from(el.children).forEach((child, i) => {
      const r = (child as HTMLElement).getBoundingClientRect();
      const overlap = Math.min(r.right, box.right) - Math.max(r.left, box.left);
      if (overlap / r.width > 0.6) vis.push(i);
    });
    setVisible(vis.length ? vis : [0]);
  }, []);

  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      update();
    });
  }, [update]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  /* ---------- reduced motion ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ---------- one orchestrated entrance + in-view tracking ---------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setSettled(true), 1400);
    return () => clearTimeout(t);
  }, [revealed]);

  /* ---------- navigation ---------- */
  const step = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length < 2) return 0;
    return (
      (el.children[1] as HTMLElement).offsetLeft -
      (el.children[0] as HTMLElement).offsetLeft
    );
  }, []);

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({
        left: dir * step(),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [step, reduced],
  );

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const firstEl = el.children[0] as HTMLElement;
      const target = (el.children[i] as HTMLElement | undefined)?.offsetLeft ?? 0;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: Math.min(target - firstEl.offsetLeft, max),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  /* ---------- autoplay (stops while the popup is open) ---------- */
  useEffect(() => {
    if (reduced || paused || dragging || !inView || formOpen) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByCard(1);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduced, paused, dragging, inView, formOpen, scrollByCard]);

  /* ---------- keyboard ---------- */
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  /* ---------- mouse drag (touch uses native swipe) ---------- */
  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startLeft: el.scrollLeft,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };

  const endDrag = (e: ReactPointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved && el) {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      setDragging(false);
      setTimeout(() => (drag.current.moved = false), 0);
    }
  };

  /* ---------- card hover: 3D tilt + spotlight ---------- */
  const onCardMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || drag.current.moved) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (reduced) return;
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 8}deg`);
    el.style.setProperty("--rx", `${(0.5 - y / r.height) * 8}deg`);
    el.style.setProperty("--ty", "-8px");
  };

  const onCardLeave = (e: ReactPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--ty", "0px");
  };

  const fitsAll = !canPrev && !canNext;
  const first = visible[0] ?? 0;
  const last = visible[visible.length - 1] ?? 0;

  const navBtn =
    "grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-ink shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)] transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-ink enabled:hover:text-white enabled:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40";

  const thumbWidth = Math.max((visible.length / goals.length) * 100, 14);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="growth-goals-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-10 sm:py-15 md:py-20"
    >
      <style>{`
        @keyframes gg-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, 28px, 0) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gg-float { animation: none !important; }
        }
      `}</style>

      {/* ambient colour washes + fine dot grid (decorative, light only) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="gg-float absolute -left-24 top-0 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl"
          style={{
            background: "#38bdf8",
            animation: "gg-float 16s ease-in-out infinite",
          }}
        />
        <div
          className="gg-float absolute -right-20 bottom-0 h-[24rem] w-[24rem] rounded-full opacity-20 blur-3xl"
          style={{
            background: "#a78bfa",
            animation: "gg-float 20s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%)",
          }}
        />
      </div>

      <div className="wrap relative z-10">
        {/* Heading + subheading */}
        <div
          className={`max-w-7xl transition-all duration-1000 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2
            id="growth-goals-heading"
            className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl"
          >
            Marketing services built around your business goals
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Choose the outcome you want to achieve. Each service combines strategy,
            creative and performance tracking to deliver measurable results.
          </p>
        </div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Marketing services by business goal"
          className="mt-10 md:mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 4000)}
        >
          <ul
            ref={trackRef}
            tabIndex={0}
            aria-label="Goals, use left and right arrow keys to browse"
            onScroll={onScroll}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(e) => {
              if (drag.current.moved) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            /* Mobile (<640px): no side padding/negative margin, so exactly one card shows.
               From sm up: the original gutters (-mx-4 / px-4) are restored. */
            className={`-my-10 flex gap-4 overflow-x-auto overscroll-x-contain py-10 outline-none sm:-mx-4 sm:scroll-px-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              dragging
                ? "cursor-grabbing select-none snap-none"
                : "cursor-grab snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto"
            }`}
          >
            {goals.map((g, i) => {
              const active = visible.includes(i);
              return (
                <li
                  key={g.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${goals.length}`}
                  className="min-w-0 shrink-0 basis-full snap-start transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
                  style={{
                    opacity: revealed ? (active ? 1 : 0.5) : 0,
                    transform: revealed ? "none" : "translateY(40px)",
                    transitionDelay: settled ? "0ms" : `${200 + i * 110}ms`,
                  }}
                >
                  <article
                    onPointerMove={onCardMove}
                    onPointerLeave={onCardLeave}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_-20px_rgba(15,23,42,0.18)] transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_36px_70px_-24px_color-mix(in_srgb,var(--c1)_45%,transparent)]"
                    style={
                      {
                        "--c1": g.from,
                        "--c2": g.to,
                        transform:
                          "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0px))",
                      } as CSSProperties
                    }
                  >
                    {/* TOP: artwork, 2:1 (card colour shows through if the file is missing) */}
                    <div
                      className="relative aspect-[2/1] w-full shrink-0 overflow-hidden"
                      style={{ background: CARD_GRADIENT }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                    </div>

                    {/* BOTTOM: text + action */}
                    <div className="flex flex-1 flex-col p-5" style={{ background: g.bg }}>
                      <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-ink">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {g.text}
                      </p>

                      {/* action row pinned to the bottom */}
                      <div className="mt-auto pt-5">
                        <span
                          aria-hidden
                          className="mb-4 block h-px w-full origin-left scale-x-[0.16] transition-transform duration-700 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--c1), var(--c2), transparent)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => openForm(e.currentTarget)}
                          aria-haspopup="dialog"
                          aria-label={`Learn more about ${g.title}`}
                          className="inline-flex items-center gap-2.5 text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-[color:var(--c1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
                        >
                          Learn More
                          <span
                            aria-hidden
                            className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-slate-200/80 bg-white transition-all duration-300 group-hover:translate-x-1 group-hover:border-transparent group-hover:text-white"
                          >
                            <span
                              className="absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100"
                              style={{ background: CARD_GRADIENT }}
                            />
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="relative"
                            >
                              <path d="M5 12h14" />
                              <path d="m13 6 6 6-6 6" />
                            </svg>
                          </span>
                          {/* stretch the button over the whole card */}
                          <span aria-hidden className="absolute inset-0" />
                        </button>
                      </div>
                    </div>

                    {/* hover effects, kept last so they sit over the artwork and text */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={edgeStyle}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--c1) 16%, transparent), transparent 65%)",
                      }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-[1100ms] ease-out group-hover:left-[130%] group-hover:opacity-100"
                    />
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Centered controls: prev · dots · next */}
          <div
            className={`mt-8 flex items-center justify-center gap-5 transition-opacity delay-500 duration-700 ${
              fitsAll ? "hidden" : ""
            } ${revealed ? "opacity-100" : "opacity-0"}`}
          >
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous goals"
              className={navBtn}
            >
              <ArrowIcon dir="left" />
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              {goals.map((g, i) => {
                const on = i >= first && i <= last;
                return (
                  <button
                    key={g.title}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to ${g.title}`}
                    aria-current={on ? "true" : undefined}
                    className={`h-2 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                      on ? "w-7 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next goals"
              className={navBtn}
            >
              <ArrowIcon dir="right" />
            </button>
          </div>
        </div>
      </div>

      {/* same form as the hero, opened by any "Learn More" button */}
      <LeadModal open={formOpen} onClose={closeForm} />
    </section>
  );
}