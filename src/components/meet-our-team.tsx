"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

type Member = {
  id: string;
  name: string;
  role: string;
  img: string;
  pos: string;
};

const TEAM: Member[] = [
  {
    id: "supraja",
    name: "Supraja N",
    role: "Founder of Tech.Mind",
    img: "/supraja.png",
    pos: "50% 30%",
  },
  {
    id: "ramu",
    name: "Ramu Eadunoori",
    role: "Senior Performance Marketing Manager",
    img: "/ramu.png",
    pos: "50% 25%",
  },
  {
    id: "srinivas",
    name: "Srinivas Amirisetti",
    role: "Senior Digital Marketing Manager",
    img: "/srinivas.png",
    pos: "45% 30%",
  },
  {
    id: "rajendra",
    name: "Rajendra Reddy",
    role: "Senior Branding Manager",
    img: "/rajendra.png",
    pos: "50% 25%",
  },
  {
    id: "sushanth",
    name: "Sushanth Reddy Bathula",
    role: "Full-Stack Engineering Lead",
    img: "/sushanth.png",
    pos: "50% 30%",
  },
  {
    id: "vamshi",
    name: "Vamshi Krishna",
    role: "Senior Meta Ads Specialists",
    img: "/vamshi.png",
    pos: "50% 25%",
  },
];

const MOBILE_QUERY = "(max-width: 767px)";
const isMobileViewport = () =>
  typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;

export default function MeetOurTeam() {
  const [active, setActive] = useState<number>(0);
  const [seen, setSeen] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Always-fresh active index (avoids stale closures in scroll handlers)
  const activeRef = useRef<number>(0);
  // While a programmatic (button / dot / key) scroll is animating, the scroll
  // listener must NOT overwrite the active index, otherwise it fights the animation.
  const lockRef = useRef<boolean>(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // Orchestrated entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const unlock = useCallback(() => {
    lockRef.current = false;
    if (lockTimer.current) {
      clearTimeout(lockTimer.current);
      lockTimer.current = null;
    }
  }, []);

  // Center a card inside the mobile track
  const scrollToCard = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const card = track?.children[i] as HTMLElement | undefined;
      if (!track || !card) return;
      const t = track.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const left = track.scrollLeft + (c.left + c.width / 2) - (t.left + t.width / 2);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left, behavior: reduced ? "auto" : behavior });
    },
    []
  );

  // Single entry point to change the active member
  const selectIndex = useCallback(
    (i: number, scroll: boolean) => {
      const next = ((i % TEAM.length) + TEAM.length) % TEAM.length;
      activeRef.current = next;
      setActive(next);
      if (scroll && isMobileViewport()) {
        lockRef.current = true;
        if (lockTimer.current) clearTimeout(lockTimer.current);
        // Safety net in case `scrollend` is not supported
        lockTimer.current = setTimeout(unlock, 800);
        scrollToCard(next);
      }
    },
    [scrollToCard, unlock]
  );

  // Release the lock when the animated scroll finishes (where supported),
  // and when the user touches the track again (their gesture takes over).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onEnd = () => unlock();
    track.addEventListener("scrollend", onEnd);
    track.addEventListener("touchstart", onEnd, { passive: true });
    track.addEventListener("pointerdown", onEnd, { passive: true });
    return () => {
      track.removeEventListener("scrollend", onEnd);
      track.removeEventListener("touchstart", onEnd);
      track.removeEventListener("pointerdown", onEnd);
      if (lockTimer.current) clearTimeout(lockTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [unlock]);

  // Keep the active card centered on rotate / resize
  useEffect(() => {
    const onResize = () => {
      if (isMobileViewport()) scrollToCard(activeRef.current, "auto");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollToCard]);

  // Swiping: track the card closest to the center (rAF-throttled)
  const handleScroll = useCallback(() => {
    if (lockRef.current || !isMobileViewport()) return;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const track = trackRef.current;
      if (!track) return;
      const t = track.getBoundingClientRect();
      const center = t.left + t.width / 2;
      let closest = 0;
      let min = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const r = (child as HTMLElement).getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < min) {
          min = dist;
          closest = i;
        }
      });
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        setActive(closest);
      }
    });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectIndex(activeRef.current + 1, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectIndex(activeRef.current - 1, true);
    }
  };

  // Hover / focus drive the desktop accordion only. On mobile, touch
  // emulates mouseenter/focus on tap, which would fight the carousel.
  const onCardHover = (i: number) => {
    if (!isMobileViewport()) selectIndex(i, false);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="team-heading"
      className={`tm-section ${seen ? "is-in" : ""}`}
    >
      <div className="mesh-hero" aria-hidden="true">
        <div className="mesh-grid" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
        <div className="mesh-blob three" />
      </div>

      <div className="wrap tm-inner">
        <header className="tm-head">
          <h2 id="team-heading" className="font-display tm-title">
            Meet our team of digital marketing experts
          </h2>
          <p className="tm-lede">
            The people who plan, build and measure your growth. Select a
            portrait to see who they are.
          </p>
        </header>

        <div
          ref={trackRef}
          className="tm-row"
          role="tablist"
          aria-label="Team members"
          onKeyDown={onKeyDown}
          onScroll={handleScroll}
        >
          {TEAM.map((m, i) => {
            const isActive = i === active;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`tab-${m.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${m.id}`}
                aria-label={`${m.name}, ${m.role}`}
                tabIndex={isActive ? 0 : -1}
                data-active={isActive}
                className="tm-card"
                style={{ "--i": i } as CSSProperties}
                onMouseEnter={() => onCardHover(i)}
                onFocus={() => onCardHover(i)}
                onClick={() => selectIndex(i, true)}
              >
                <img
                  src={m.img}
                  alt=""
                  loading="lazy"
                  draggable="false"
                  className="tm-photo"
                  style={{ objectPosition: m.pos }}
                />
                <span className="tm-veil" aria-hidden="true" />
                <span className="tm-mini" aria-hidden="true">
                  <span className="tm-mini-text">{m.name}</span>
                </span>
                <span className="tm-caption" id={`panel-${m.id}`}>
                  <span className="tm-bar" aria-hidden="true" />
                  <span className="font-display tm-name">{m.name}</span>
                  <span className="tm-role">{m.role}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile carousel controls */}
        <div className="tm-carousel-nav">
          <button
            type="button"
            className="tm-arrow"
            aria-label="Previous team member"
            onClick={() => selectIndex(activeRef.current - 1, true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="tm-dots" role="group" aria-label="Team member pagination">
            {TEAM.map((m, i) => (
              <button
                key={m.id}
                type="button"
                aria-current={i === active ? "true" : undefined}
                aria-label={`Go to ${m.name}`}
                onClick={() => selectIndex(i, true)}
                data-active={i === active}
                className="tm-dot-btn"
              >
                <span className="tm-dot" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="tm-arrow"
            aria-label="Next team member"
            onClick={() => selectIndex(activeRef.current + 1, true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .tm-section {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(180deg, var(--paper) 0%, var(--mist) 100%);
          color: var(--ink);
          padding-block: clamp(1.5rem, 9vw, 5rem);
        }
        .tm-inner { position: relative; z-index: 1; }

        .tm-head {
          max-width: 80rem;
          margin-bottom: clamp(2rem, 5vw, 3.5rem);
        }
        .tm-title {
          margin: 0;
          color: var(--ink);
          font-weight: 500;
          font-size: clamp(2rem, 4.6vw, 3.6rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
        }
        .tm-lede {
          margin: 1rem 0 0;
          max-width: 80rem;
          color: var(--ink-soft);
          font-size: 1.05rem;
          line-height: 1.65;
        }

        /* ---------- Row of portraits (desktop) ---------- */
        .tm-row {
          display: flex;
          gap: 0.9rem;
          height: clamp(26rem, 46vw, 36rem);
        }

        .tm-card {
          position: relative;
          flex: 1 1 0%;
          min-width: 0;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          text-align: left;
          border: 1px solid var(--line);
          border-radius: 1.75rem;
          background: var(--paper-raised);
          box-shadow: var(--shadow-soft);
          -webkit-tap-highlight-color: transparent;
          transition:
            flex-grow 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.6s ease,
            border-color 0.4s ease,
            height 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          clip-path: inset(100% 0 0 0 round 1.75rem);
          opacity: 0;
        }
        .tm-section.is-in .tm-card {
          animation: tm-reveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--i) * 110ms + 150ms);
        }
        @keyframes tm-reveal {
          to { clip-path: inset(0 0 0 0 round 1.75rem); opacity: 1; }
        }

        .tm-card[data-active="true"] {
          flex-grow: 4.2;
          border-color: rgba(20, 184, 166, 0.55);
          box-shadow: var(--shadow-glow), var(--shadow-lift);
        }
        .tm-card:focus-visible { outline-offset: 4px; }

        .tm-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.85) saturate(0.8) brightness(1.04);
          transform: scale(1.14);
          transition:
            filter 0.9s ease,
            transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
          user-select: none;
          -webkit-user-drag: none;
        }
        .tm-card[data-active="true"] .tm-photo {
          filter: none;
          transform: scale(1);
        }

        .tm-veil {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(244, 248, 247, 0) 55%, rgba(244, 248, 247, 0.55) 100%);
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .tm-card[data-active="true"] .tm-veil { opacity: 1; }

        .tm-mini {
          position: absolute;
          left: 50%;
          bottom: 1rem;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          padding: 0.9rem 0.55rem;
          border: 1px solid var(--glass-border);
          border-radius: 999px;
          background: var(--glass-bg);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          transition: opacity 0.35s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tm-mini-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          white-space: nowrap;
          max-height: 15rem;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--ink);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .tm-card[data-active="true"] .tm-mini {
          opacity: 0;
          transform: translate(-50%, 12px);
          pointer-events: none;
        }

        .tm-caption {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 1.15rem 1.35rem 1.2rem;
          border: 1px solid var(--glass-border);
          border-radius: 1.25rem;
          background: var(--glass-bg);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          box-shadow: var(--shadow-soft);
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 0.4s ease,
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .tm-card[data-active="true"] .tm-caption {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.22s;
        }
        .tm-bar {
          display: block;
          height: 3px;
          width: 0;
          margin-bottom: 0.5rem;
          border-radius: 999px;
          background: var(--grad-accent);
          transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s;
        }
        .tm-card[data-active="true"] .tm-bar { width: 3.25rem; }
        .tm-name {
          color: var(--ink);
          font-size: clamp(1.25rem, 2.1vw, 1.7rem);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
        .tm-role {
          color: var(--ink-soft);
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
        }

        /* ---------- Carousel nav (hidden on desktop) ---------- */
        .tm-carousel-nav {
          display: none;
        }
        .tm-arrow {
          display: grid;
          place-items: center;
          width: 2.75rem;
          height: 2.75rem;
          flex: 0 0 auto;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--paper-raised);
          color: var(--ink);
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
        }
        .tm-arrow:hover { border-color: var(--teal-deep); box-shadow: var(--shadow-soft); }
        .tm-arrow:active { transform: scale(0.94); }
        .tm-arrow:focus-visible { outline-offset: 3px; }

        /* ---------- Mobile: carousel (no marquee) ---------- */
        @media (max-width: 767px) {
          .tm-carousel-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .tm-dots {
            display: flex;
            gap: 0.15rem;
            flex: 0 0 auto;
            justify-content: center;
            align-items: center;
          }
          .tm-dot-btn {
            appearance: none;
            border: none;
            background: transparent;
            padding: 0.85rem 0.4rem; /* comfortable tap target */
            cursor: pointer;
            line-height: 0;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .tm-dot-btn:focus-visible { outline-offset: 2px; }
          .tm-dot {
            display: block;
            height: 6px;
            width: 6px;
            border-radius: 999px;
            background: var(--line);
            transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease;
          }
          .tm-dot-btn[data-active="true"] .tm-dot {
            width: 1.5rem;
            background: var(--teal-deep);
          }

          /* Horizontal snap carousel: one card at a time, no infinite loop.
             Smooth scrolling is driven from JS so it never fights the snap. */
          .tm-row {
            flex-direction: row;
            flex-wrap: nowrap;
            height: 26rem;
            gap: 0;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: auto;
            overscroll-behavior-x: contain;
            touch-action: pan-x pan-y;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            margin-inline: calc(var(--gutter, 1rem) * -1);
            padding-inline: var(--gutter, 1rem);
            border-radius: 1.75rem;
          }
          .tm-row::-webkit-scrollbar { display: none; }

          .tm-card {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            border-radius: 1.75rem;
            transform: translateX(0);
          }
          .tm-card + .tm-card { margin-left: 0.75rem; }

          /* Every card in the carousel behaves as "active" visually */
          .tm-card .tm-photo {
            filter: none;
            transform: scale(1);
          }
          .tm-card .tm-veil { opacity: 1; }
          .tm-card .tm-mini { display: none; }
          .tm-card .tm-caption {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0s;
          }
          .tm-card .tm-bar { width: 3.25rem; }
          .tm-photo { object-position: 50% 22% !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tm-card,
          .tm-photo,
          .tm-caption,
          .tm-mini,
          .tm-bar,
          .tm-dot {
            transition: none !important;
          }
          .tm-card {
            clip-path: none;
            opacity: 1;
            animation: none !important;
          }
          .tm-row { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  );
}