"use client";

import { useEffect } from "react";

/**
 * One global listener that feeds --mx / --my to whichever .spot-card the
 * pointer is over, powering the cursor-tracking glow defined in globals.css.
 */
export default function SpotlightEffect() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(".spot-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
