"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import ClientCard from "./ClientCard";
import { clients, sectors } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;
const TEAL = "var(--color-teal-deep, #0f766e)";

/* Services stay searchable even though they are no longer a dropdown */
const allTags = Array.from(new Set(clients.flatMap((c) => c.tags))).sort();
const hints = [...sectors, ...allTags];

const searchIndex = clients.map((c) => ({
  client: c,
  text: [...(Object.values(c) as unknown[]).filter((v): v is string => typeof v === "string"), ...c.tags]
    .join(" ")
    .toLowerCase(),
}));

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden>
    <circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.6" />
    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
    <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden>
    <rect x="3" y="3" width="5.5" height="5.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    viewBox="0 0 12 12"
    fill="none"
    className="h-3 w-3"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.35, ease: EASE }}
    aria-hidden
  >
    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden>
    <path d="M3 7.5l2.6 2.6L11 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Search field: orbiting light on focus, rotating hints, "/" shortcut */
/* ------------------------------------------------------------------ */

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState(0);

  useEffect(() => {
    if (reduce || value || focused) return;
    const t = setInterval(() => setHint((h) => (h + 1) % hints.length), 2400);
    return () => clearInterval(t);
  }, [reduce, value, focused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-full bg-line p-[1.5px]">
      {/* orbiting light along the border */}
      <motion.span
        aria-hidden
        style={{
          x: "-50%",
          y: "-50%",
          background: `conic-gradient(from 0deg, transparent 0 55%, ${TEAL} 78%, #5eead4 90%, transparent 100%)`,
        }}
        animate={{ rotate: reduce ? 0 : 360, opacity: focused ? 1 : 0 }}
        transition={{ rotate: { duration: 3.5, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.4 } }}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[160%]"
      />

      <div
        className={`relative flex h-[53px] items-center rounded-full bg-paper transition-shadow duration-500 ${
          focused ? "shadow-[0_10px_40px_-12px_rgba(15,118,110,0.35)]" : ""
        }`}
      >
        <span
          className={`pointer-events-none absolute left-5 transition-colors duration-300 ${
            focused ? "text-teal-deep" : "text-slate"
          }`}
        >
          <SearchIcon />
        </span>

        {/* rotating hint */}
        <div aria-hidden className="pointer-events-none absolute left-[3.25rem] flex items-center gap-1.5 text-sm text-slate/80">
          <AnimatePresence initial={false}>
            {!value && !focused && (
              <motion.span
                key="lead"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                Search
              </motion.span>
            )}
          </AnimatePresence>
          <span className="relative inline-flex h-5 items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {!value && !focused && (
                <motion.span
                  key={hints[hint]}
                  initial={{ y: reduce ? 0 : 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduce ? 0 : -14, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="font-medium text-teal-deep"
                >
                  {hints[hint]}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          {focused && !value && <span>Type a name, industry or service</span>}
        </div>

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Search clients"
          autoComplete="off"
          className="h-full w-full rounded-full bg-transparent pl-[3.25rem] pr-24 text-sm text-ink outline-none [&::-webkit-search-cancel-button]:hidden"
        />

        <div className="absolute right-3 flex items-center gap-2">
          <AnimatePresence>
            {!value && !focused && (
              <motion.kbd
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-line bg-mist px-1.5 font-sans text-xs font-medium text-slate sm:flex"
              >
                /
              </motion.kbd>
            )}
            {value && (
              <motion.button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onChange("");
                  inputRef.current?.focus();
                }}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={SPRING}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-mist text-slate transition-colors hover:bg-teal-tint hover:text-teal-deep"
              >
                <CloseIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Industry menu: full keyboard support + gliding highlight            */
/* ------------------------------------------------------------------ */

function IndustryMenu({
  value,
  options,
  onChange,
}: {
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  const reduce = useReducedMotion();
  const items = useMemo<(string | null)[]>(() => [null, ...options], [options]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const optRefs = useRef<(HTMLDivElement | null)[]>([]);
  const uid = useId();
  const on = value !== null;

  const openMenu = () => {
    setActive(Math.max(0, items.indexOf(value)));
    setOpen(true);
  };
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  };
  const select = (i: number) => {
    onChange(items[i]);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) optRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onListKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a === last ? 0 : a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a === 0 ? last : a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(active);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div ref={wrap} className="relative">
      <motion.button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            openMenu();
          }
        }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={SPRING}
        className={`relative flex h-14 w-full items-center gap-3 overflow-hidden rounded-full border px-5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
          on
            ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
            : "border-line bg-paper text-slate hover:border-teal-deep hover:text-teal-deep"
        }`}
      >
        <GridIcon />
        <span className="relative h-5 flex-1 overflow-hidden text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value ?? "all"}
              initial={{ y: reduce ? 0 : 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduce ? 0 : -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="block truncate leading-5"
            >
              {value ?? "All industries"}
            </motion.span>
          </AnimatePresence>
        </span>
        <Chevron open={open} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : -10, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-30 mt-3 w-full min-w-[16rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_24px_60px_-20px_rgba(15,60,56,0.35)]"
          >
            <motion.div
              ref={list}
              layoutScroll
              role="listbox"
              aria-label="Industry"
              aria-activedescendant={`${uid}-${active}`}
              tabIndex={0}
              onKeyDown={onListKey}
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="max-h-80 touch-pan-y overflow-y-auto overscroll-contain p-2 outline-none [scrollbar-color:var(--color-line,#d6e2df)_transparent] [scrollbar-width:thin]"
            >
              {items.map((o, i) => {
                const selected = o === value;
                return (
                  <motion.div
                    key={o ?? "__all"}
                    id={`${uid}-${i}`}
                    ref={(el) => {
                      optRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={selected}
                    onPointerMove={() => active !== i && setActive(i)}
                    onClick={() => select(i)}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: reduce ? 0 : 0.04 + i * 0.025 }}
                    className={`relative flex cursor-pointer items-center justify-between gap-6 rounded-2xl px-4 py-3 text-sm ${
                      selected ? "font-semibold text-teal-deep" : "text-ink"
                    }`}
                  >
                    {active === i && (
                      <motion.span
                        layoutId={`${uid}-hl`}
                        transition={reduce ? { duration: 0 } : SPRING}
                        className={`absolute inset-0 rounded-2xl ${selected ? "bg-teal-tint" : "bg-mist"}`}
                      />
                    )}
                    <span className="relative">{o ?? "All industries"}</span>
                    {selected && (
                      <motion.span
                        className="relative"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={SPRING}
                      >
                        <CheckIcon />
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
              <div aria-hidden className="h-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt card with moving light                                         */
/* ------------------------------------------------------------------ */

function TiltCard({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 220, damping: 22 });
  const ry = useSpring(0, { stiffness: 220, damping: 22 });
  const glow = useMotionValue(0);
  const light = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(255,255,255,0.6), transparent 55%)`;
  const edge = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, rgba(45,212,191,0.9), transparent 70%)`;

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
    glow.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { y: -8 }}
        transition={SPRING}
        className="relative h-full rounded-2xl will-change-transform"
      >
        {children}
        {!reduce && (
          <>
            {/* soft sheen */}
            <motion.div
              aria-hidden
              style={{ background: light, opacity: glow }}
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-soft-light"
            />
            {/* light that travels along the card's edge */}
            <motion.div
              aria-hidden
              style={{
                background: edge,
                opacity: glow,
                WebkitMask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                padding: 1.5,
              }}
              className="pointer-events-none absolute inset-0 rounded-2xl"
            />
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ClientsExplorer() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string | null>(null);

  const list = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return searchIndex
      .filter(({ client: c, text }) => (!sector || c.sector === sector) && words.every((w) => text.includes(w)))
      .map((x) => x.client);
  }, [query, sector]);

  const hasFilters = query.trim() !== "" || sector !== null;
  const reset = () => {
    setQuery("");
    setSector(null);
  };

  /* ambient light that follows the pointer behind the grid */
  const gx = useMotionValue(-600);
  const gy = useMotionValue(-600);
  const ambient = useMotionTemplate`radial-gradient(560px circle at ${gx}px ${gy}px, rgba(20,184,166,0.13), transparent 65%)`;
  const onGridMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  };

  const shell: Variants = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.12 } } };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24, filter: reduce ? "blur(0px)" : "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36, scale: reduce ? 1 : 0.96, filter: reduce ? "blur(0px)" : "blur(6px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE, delay: (i % 3) * 0.09 },
    }),
    exit: { opacity: 0, scale: reduce ? 1 : 0.94, transition: { duration: 0.22, ease: "easeIn" } },
  };

  return (
    <motion.div variants={shell} initial="hidden" animate="show" className="max-w-full">
      {/* ---------------- Search + industry ---------------- */}
      <motion.div variants={rise} className="relative z-20 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <SearchField value={query} onChange={setQuery} />
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 md:w-64 md:flex-none">
            <IndustryMenu value={sector} options={sectors} onChange={setSector} />
          </div>
          <AnimatePresence initial={false}>
            {hasFilters && (
              <motion.button
                type="button"
                onClick={reset}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="shrink-0 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium text-slate underline-offset-4 transition-colors hover:text-teal-deep hover:underline"
              >
                <span className="px-2">Clear all</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ---------------- Grid ---------------- */}
      <motion.div variants={rise} className="relative isolate mt-12" onPointerMove={onGridMove}>
        {/* FIX: bleed vertically only (-inset-y-10). The old -inset-10 pushed this
            element 40px past the grid on the left/right, which on mobile stuck out
            of the viewport and made the whole page scroll sideways. */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: ambient }}
            className="pointer-events-none absolute inset-x-0 -inset-y-10 -z-10"
          />
        )}

        <motion.div layout aria-live="polite" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((c, i) => (
              <motion.div
                key={c.slug}
                layout
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                exit="exit"
                transition={{ layout: reduce ? { duration: 0 } : SPRING }}
                className="min-w-0"
              >
                <TiltCard>
                  <ClientCard client={c} />
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ---------------- Empty state ---------------- */}
      <AnimatePresence>
        {list.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mt-6 overflow-hidden rounded-3xl border border-dashed border-line px-6 py-20 text-center"
          >
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-6 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-tint blur-3xl" />

            <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center">
              {!reduce &&
                [0, 1].map((n) => (
                  <motion.span
                    key={n}
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-teal-deep/30"
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: n * 1.4 }}
                  />
                ))}
              <motion.div
                aria-hidden
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full border border-teal-deep/30 bg-paper text-teal-deep shadow-[var(--shadow-soft)]"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-7 w-7">
                  <circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>

            <p className="relative font-display text-2xl text-ink [overflow-wrap:anywhere]">
              {query.trim() ? `Nothing found for “${query.trim()}”.` : "No clients in this industry yet."}
            </p>
            <p className="relative mx-auto mt-2 max-w-sm text-sm text-slate">
              Try a different keyword or industry, or clear the filters to see all of our work.
            </p>
            <motion.button
              type="button"
              onClick={reset}
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={SPRING}
              className="relative mt-8 rounded-full border border-teal-deep px-7 py-3 text-sm font-semibold text-teal-deep outline-none transition-colors hover:bg-teal-deep hover:text-paper focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}