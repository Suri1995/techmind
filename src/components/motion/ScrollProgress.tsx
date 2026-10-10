"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin brand-coloured bar at the very top that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-teal-deep via-teal to-amber"
    />
  );
}
