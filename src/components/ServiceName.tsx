"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  /** The service name. Plain text, e.g. {service.name}. */
  children: React.ReactNode;
  /** "light" for pale sections, "dark" for ink sections. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Premium inline highlight for a service name.
 *  - Each word rises out of a mask, one after another.
 *  - The letters carry a teal-to-sky gradient with a soft light glint that repeats.
 *  - A thin underline draws under every word, then a bright spark travels along it.
 *  - A small sparkle pops in at the end of the name.
 * Plays once when scrolled into view. Wraps cleanly on small screens.
 * Reduced-motion users see the finished, static state.
 */
export default function ServiceName({ children, tone = "light", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = !!useReducedMotion();
  const show = reduce || inView;
  const dark = tone === "dark";

  const c1 = dark ? "var(--color-aqua, #5eead4)" : "var(--color-teal-deep, #0f766e)";
  const c2 = dark ? "#7dd3fc" : "var(--color-teal, #14b8a6)";
  const glint = dark ? "#ffffff" : "#99f6e4";
  const glow = dark ? "drop-shadow(0 0 18px rgba(94,234,212,0.28))" : "none";

  const words = String(children).split(/\s+/).filter(Boolean);

  return (
    <span ref={ref} className={`inline ${className}`} style={{ filter: glow }}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="relative inline-block pb-[0.14em] align-bottom -mb-[0.14em]">
            {/* masked rise */}
            <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em] pt-[0.08em] -mt-[0.08em]">
              <motion.span
                className="block bg-clip-text text-transparent [-webkit-text-fill-color:transparent]"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${c1} 0%, ${c2} 38%, ${glint} 50%, ${c2} 62%, ${c1} 100%)`,
                  backgroundSize: "260% 100%",
                  backgroundPosition: "100% 0",
                }}
                initial={reduce ? false : { y: "115%", opacity: 0 }}
                animate={
                  show
                    ? {
                        y: "0%",
                        opacity: 1,
                        backgroundPosition: reduce ? "100% 0" : ["100% 0", "0% 0", "0% 0"],
                      }
                    : { y: "115%", opacity: 0 }
                }
                transition={{
                  y: { duration: 0.8, delay: 0.1 + i * 0.12, ease },
                  opacity: { duration: 0.5, delay: 0.1 + i * 0.12 },
                  backgroundPosition: {
                    duration: 2.4,
                    delay: 1.3 + i * 0.25,
                    times: [0, 0.5, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 5,
                  },
                }}
              >
                {w}
              </motion.span>
            </span>

            {/* underline */}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-full">
              <motion.span
                className="absolute inset-0 origin-left rounded-full"
                style={{ backgroundImage: `linear-gradient(90deg, ${c1}, ${c2})` }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: show ? 1 : 0 }}
                transition={{ duration: 0.9, delay: 0.55 + i * 0.12, ease }}
              />
              {!reduce && show && (
                <motion.span
                  className="absolute inset-y-0 w-10 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: "-120%" }}
                  animate={{ x: ["-120%", "420%"] }}
                  transition={{
                    duration: 1.6,
                    delay: 1.8 + i * 0.25,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 5.5,
                  }}
                />
              )}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}

      {/* sparkle */}
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        className="relative -top-[0.55em] ml-[0.15em] inline-block h-[0.45em] w-[0.45em]"
        style={{ color: dark ? "var(--color-aqua, #5eead4)" : "var(--color-teal, #14b8a6)" }}
        initial={reduce ? false : { scale: 0, rotate: -90, opacity: 0 }}
        animate={show ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 + words.length * 0.12 }}
      >
        <motion.path
          d="M12 0 14.6 9.4 24 12 14.6 14.6 12 24 9.4 14.6 0 12 9.4 9.4Z"
          fill="currentColor"
          animate={reduce ? undefined : { scale: [1, 0.7, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
        />
      </motion.svg>
    </span>
  );
}