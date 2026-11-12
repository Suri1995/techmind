import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { IconArrowRight } from "@/components/icons";
import { company } from "@/lib/data";

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-gradient-to-b from-paper to-mist py-20 text-ink md:py-28">
      <div className="mesh-hero">
        <div className="mesh-grid" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
      </div>

      <Reveal className="wrap relative">
        <p className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
          <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-teal-deep/60 to-transparent" />
          Strategy | Creativity | Performance
        </p>

        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink [text-wrap:balance] md:text-6xl">
          Ready to build your brand and{" "}
          <span className="text-gradient">grow with purpose?</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Magnetic>
            <Link
              href="/contact"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-8 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-ink hover:text-paper"
            >
              Discuss Your Project
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
          <a
            href={`mailto:${company.email}`}
            className="link-underline text-sm font-semibold text-ink hover:text-teal-deep"
          >
            {company.email}
          </a>
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="link-underline text-sm font-semibold text-ink hover:text-teal-deep"
          >
            {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}