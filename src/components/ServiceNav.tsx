"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/lib/data";

export default function ServiceNav({ services }: { services: Service[] }) {
  const [active, setActive] = useState(services[0]?.slug);

  useEffect(() => {
    const sections = services
      .map((s) => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services]);

  return (
    <nav aria-label="Jump to service" className="sticky top-16 z-30 border-b border-line glass-surface py-3">
      <div className="wrap flex gap-2 overflow-x-auto text-sm [scrollbar-width:none]">
        {services.map((service) => (
          <a
            key={service.slug}
            href={`#${service.slug}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 transition-all duration-300 ${
              active === service.slug
                ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
            }`}
          >
            {service.number} {service.name.replace("Cinema Graphics & Video Editing", "Video & Graphics").replace("Complete Performance Marketing", "Performance Marketing")}
          </a>
        ))}
      </div>
    </nav>
  );
}
