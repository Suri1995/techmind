"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { IconMail, IconPhone, IconPin } from "@/components/icons";

const ease = [0.22, 1, 0.36, 1] as const;

const assurances = [
  { title: "Short intro call", text: "A focused conversation about your goals." },
  { title: "No pressure", text: "Honest advice, whether or not we end up working together." },
  { title: "No generic pitch deck", text: "Everything we share is built around your business." },
];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 1, staggerChildren: 0.14 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/* ------------------------------------------------------------------ */
/* Live studio status                                                  */
/* ------------------------------------------------------------------ */
function useStudioStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hour12: false,
        weekday: "short",
        timeZone: "Asia/Kolkata",
      }).formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === "hour")?.value);
      const day = parts.find((p) => p.type === "weekday")?.value;
      const open = day !== "Sun" && hour >= 10 && hour < 19;
      setStatus({
        open,
        label: open
          ? "Online now · usually replies within the hour"
          : "Offline · we reply first thing at 10 AM IST",
      });
    };
    compute();
    const id = window.setInterval(compute, 60000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

/* ------------------------------------------------------------------ */
/* Orbit: radar sweep, two counter-rotating rings, glowing core        */
/* ------------------------------------------------------------------ */
const rings = [
  { inset: "0%", duration: 80, dashed: false, reverse: false, Icon: IconMail },
  { inset: "20%", duration: 60, dashed: true, reverse: true, Icon: IconPhone },
  { inset: "40%", duration: 45, dashed: false, reverse: false, Icon: IconPin },
];

function Orbit() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-[32rem] w-[32rem]" aria-hidden>
      <div className="absolute inset-[12%] rounded-full bg-aqua/10 blur-3xl" />

      <motion.div
        className="absolute inset-[2%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(103,232,214,0.28)_70deg,transparent_71deg)] [mask-image:radial-gradient(circle,transparent_18%,black_20%)]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {rings.map(({ inset, duration, dashed, reverse, Icon }, i) => {
        const spin = reverse ? -360 : 360;
        const t = { duration, repeat: Infinity, ease: "linear" as const };
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full border ${
              dashed ? "border-dashed border-white/20" : "border-white/15"
            }`}
            style={{ inset }}
            animate={reduce ? undefined : { rotate: spin }}
            transition={t}
          >
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#052a2c]/80 text-aqua shadow-[0_0_28px_rgba(103,232,214,0.3)] ring-1 ring-inset ring-white/25 backdrop-blur-md"
                animate={reduce ? undefined : { rotate: -spin }}
                transition={t}
              >
                <Icon className="h-4 w-4" />
              </motion.span>
            </span>
          </motion.div>
        );
      })}

      <div className="absolute inset-[45%]">
        <motion.span
          className="absolute inset-0 rounded-full border border-aqua/40"
          animate={reduce ? undefined : { scale: [1, 2.6], opacity: [0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#c9fbf1,#2dd4bf_45%,#0b5d57)] shadow-[0_0_60px_14px_rgba(45,212,191,0.45)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ContactHero                                                         */
/* ------------------------------------------------------------------ */
export default function ContactHero() {
  const status = useStudioStatus();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(167,243,230,0.14), transparent 70%)`;
  const spring = { stiffness: 60, damping: 18, mass: 0.6 };
  const ox = useSpring(useTransform(nx, [-0.5, 0.5], [24, -24]), spring);
  const oy = useSpring(useTransform(ny, [-0.5, 0.5], [24, -24]), spring);

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        if (reduce || !sectionRef.current) return;
        const r = sectionRef.current.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        mx.set(px);
        my.set(py);
        nx.set(px / r.width - 0.5);
        ny.set(py / r.height - 0.5);
      }}
      className="relative isolate overflow-hidden bg-teal-deep pb-20 pt-14 text-paper md:pb-28 md:pt-20"
    >
      {/* ---------- background ---------- */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_85%_20%,rgba(103,232,214,0.38),transparent_65%),radial-gradient(60%_70%_at_0%_100%,#031416,transparent_70%)]" />

      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_70%_at_70%_30%,black,transparent)]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* architectural column lines that draw in from the top */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {[20, 40, 60, 80].map((left, i) => (
          <motion.span
            key={left}
            className="absolute top-0 h-full w-px origin-top bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent"
            style={{ left: `${left}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease }}
          />
        ))}
      </div>

      {/* light beam sweeping along the top edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden bg-white/10">
        <motion.div
          className="h-px w-1/3 bg-gradient-to-r from-transparent via-aqua to-transparent"
          animate={reduce ? undefined : { x: ["-100%", "320%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
        />
      </div>

      <div className="noise-overlay" />

      {/* cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: spotlight }}
      />

      {/* ---------- orbit (decorative) ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-[42%] hidden -translate-y-1/2 lg:block"
      >
        <motion.div style={{ x: ox, y: oy }}>
          <Orbit />
        </motion.div>
      </div>

      {/* ---------- content ---------- */}
      <div className="wrap relative z-10">
        <HeroCrumbs tone="dark" crumbs={[{ href: "/contact", label: "Contact" }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex ml-4 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-aqua shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md"
          aria-live="polite"
        >
          <span className="relative flex h-2 w-2">
            {status?.open && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-aqua opacity-70 motion-safe:animate-ping" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${status?.open ? "bg-aqua" : "bg-amber"}`}
            />
          </span>
          {status ? status.label : "Contact us"}
        </motion.div>

        <h1 className="mt-7 max-w-4xl font-display text-[2.6rem] leading-[1.04] tracking-tight sm:text-6xl md:text-[4.5rem] lg:max-w-3xl">
          <WordReveal text="Let's talk about what you're building." stagger={0.07} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-paper/80 md:text-xl"
        >
          Send us a few details and we&apos;ll set up a short call — no pressure, no generic pitch
          deck.
        </motion.p>

        {/* assurances: hairline-divided columns with a drawing accent line */}
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={listVariants}
          className="mt-16 grid border-t border-white/15 sm:grid-cols-3 md:mt-20"
        >
          {assurances.map((a, i) => (
            <motion.li
              key={a.title}
              variants={itemVariants}
              className={`relative flex items-start gap-4 py-7 sm:px-8 ${
                i === 0 ? "sm:pl-0" : "sm:border-l sm:border-white/15"
              }`}
            >
              <motion.span
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left bg-gradient-to-r from-aqua to-transparent"
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { duration: 1.1, delay: 0.2, ease } },
                }}
              />
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-aqua ring-1 ring-inset ring-white/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: { pathLength: 1, transition: { duration: 0.8, delay: 0.4, ease } },
                    }}
                  />
                </svg>
              </span>
              <span>
                <span className="block font-display text-lg leading-snug text-paper">{a.title}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-paper/65">{a.text}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}