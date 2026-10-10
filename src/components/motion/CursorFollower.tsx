"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "idle" | "link" | "drag" | "text";

/** A trailing ring that grows over links and shows "Drag" over carousels. Mouse only. */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection must run on the client
    setEnabled(true);

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target as HTMLElement | null;
      if (el?.closest(".cursor-grab, .cursor-grabbing")) setMode("drag");
      else if (el?.closest("a, button, [role='tab'], summary, label")) setMode("link");
      else if (el?.closest("input, textarea, select")) setMode("text");
      else setMode("idle");
    }
    const hide = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "drag" ? 76 : mode === "link" ? 54 : mode === "text" ? 6 : 32;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor:
            mode === "drag"
              ? "rgba(6,31,34,0.88)"
              : mode === "link"
                ? "rgba(20,184,166,0.16)"
                : "rgba(20,184,166,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-teal/70 text-[0.7rem] font-semibold text-paper"
      >
        {mode === "drag" && "Drag"}
      </motion.div>
    </motion.div>
  );
}
