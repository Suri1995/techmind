"use client";

import { useEffect, useState } from "react";

/** Sticky "on this page" bar with scroll-spy. */
export default function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-line bg-white/95 py-3">
      <div className="wrap flex gap-2 overflow-x-auto text-sm [scrollbar-width:none]">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 transition-all duration-300 ${
              active === i.id
                ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
            }`}
          >
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
