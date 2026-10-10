"use client";

import { motion } from "framer-motion";

/**
 * Reveals text word by word, each word rising out of a clipped line.
 * With `gradient`, one teal-to-amber sweep is spread across all words.
 */
export default function WordReveal({
  text,
  delay = 0,
  stagger = 0.07,
  gradient = false,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  gradient?: boolean;
}) {
  const words = text.split(" ");
  const n = words.length;

  return (
    <span aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            style={
              gradient
                ? {
                    backgroundImage:
                      "linear-gradient(100deg, var(--teal-deep), var(--teal) 55%, var(--amber))",
                    backgroundSize: `${n * 100}% 100%`,
                    backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : undefined
            }
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < n - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
