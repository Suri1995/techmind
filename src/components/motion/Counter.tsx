"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

type Props = {
  value: string;
  className?: string;
};

/**
 * Renders a stat value like "120+", "94%" or "10+" with the numeric
 * portion animating up from 0 when it scrolls into view, preserving
 * any prefix/suffix characters (+, %, ★, etc).
 */
export default function Counter({ value, className }: Props) {
  const match = value.match(/-?\d[\d,]*\.?\d*/);
  const numeric = match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  const hasDecimal = match ? match[0].includes(".") : false;
  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : "";

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 22, stiffness: 90 });
  const display = useTransform(spring, (v) =>
    hasDecimal ? v.toFixed(1) : Math.round(v).toLocaleString("en-IN")
  );

  useEffect(() => {
    if (isInView) motionVal.set(numeric);
  }, [isInView, numeric, motionVal]);

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
