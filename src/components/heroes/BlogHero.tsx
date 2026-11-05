"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { IconArrowRight } from "@/components/icons";
import { blogPosts } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
const deck = blogPosts.slice(0, 4);

/** Typographic hero with a swipeable stack of the latest articles. */
export default function BlogHero() {
  const [order, setOrder] = useState(deck.map((_, i) => i));
  const multiple = deck.length > 1;

  const cycle = (dir: 1 | -1) =>
    setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));

  function onDragEnd(_: unknown, info: PanInfo) {
    if (!multiple) return;
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) cycle(1);
  }

  if (deck.length === 0) return null;
  const top = deck[order[0]];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#fbf6ec_0%,var(--paper)_55%)] ">
          <HeroCrumbs crumbs={[{ href: "/blog", label: "Blog" }]} />
    </section>
  );
}