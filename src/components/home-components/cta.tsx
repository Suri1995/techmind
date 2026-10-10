import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { IconArrowRight } from "@/components/icons";
import { company } from "@/lib/data";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-32">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>
      <div className="noise-overlay" />
      <Reveal className="wrap relative">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber">Strategy | Creativity | Performance</p>
        <h2 className="max-w-3xl font-display text-4xl leading-[1.08] [text-wrap:balance] md:text-6xl">
          Ready to build your brand and grow with purpose?
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Magnetic>
            <Link
              href="/contact"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-8 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-paper"
            >
              Discuss Your Project
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
          <a
            href={`mailto:${company.email}`}
            className="link-underline text-sm font-semibold text-slate-on-ink hover:text-paper"
          >
            {company.email}
          </a>
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="link-underline text-sm font-semibold text-slate-on-ink hover:text-paper"
          >
            {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
