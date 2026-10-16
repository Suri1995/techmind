import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/icons";

/** Closing call-to-action band on the /services page. */
export default function ServicesCta() {
  return (
    <section className="relative overflow-hidden bg-teal-tint py-16 md:py-20">
      <div className="mesh-hero">
        <div className="mesh-blob one" />
      </div>
      <Reveal className="wrap relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <SectionHeading
          eyebrow="Not sure where to start"
          title="Share a few project details and we'll suggest the right next steps."
          description="Plans are tailored to your business goals, audience, and budget."
        />
        <Link
          href="/contact"
          className="btn-shine inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep"
        >
          Discuss Your Project
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}