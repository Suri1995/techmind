"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { company } from "@/lib/data";
import { IconArrowRight, IconPhone } from "./icons";
import CommandPalette from "./CommandPalette";

const ease = [0.22, 1, 0.36, 1] as const;

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 700);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <div className="floating-actions">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25, ease }}
              className="flex h-11 w-11 items-center justify-center self-end rounded-full border border-line bg-paper-raised text-ink-soft shadow-[var(--shadow-soft)] transition-colors hover:border-teal-deep hover:text-teal-deep"
            >
              <IconArrowRight className="h-4 w-4 -rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search the site (Ctrl or Command + K)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex h-11 items-center gap-2 self-end rounded-full border border-line bg-paper-raised px-4 text-sm font-medium text-ink-soft shadow-[var(--shadow-soft)] transition-colors hover:border-teal-deep hover:text-teal-deep"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-line px-1.5 text-[0.65rem] text-slate sm:inline">⌘K</kbd>
        </motion.button>

        <div className="flex items-center gap-3 self-end">
          <Link
            href="/contact"
            className="btn-shine hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep md:inline-flex"
          >
            Discuss Your Project
            <IconArrowRight className="h-4 w-4" />
          </Link>
          <motion.a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            aria-label={`Call ${company.phone}`}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="pulse-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-teal-deep text-paper shadow-[var(--shadow-glow)]"
          >
            <IconPhone className="h-5 w-5" />
          </motion.a>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
