import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ClientCarousel from "@/components/ClientCarousel";
import Reveal from "@/components/motion/Reveal";
import { clients } from "@/lib/data";
import { IconArrowRight } from "@/components/icons";

export default function ClientsSection() {
  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Our clients"
              title="Brands We're Proud to Work With"
              description="Ongoing partnerships across real estate, healthcare, jewellery, hospitality, wellness, food, building materials, farming, and pet training."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/clients"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-ink py-2 pl-6 pr-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-ink-soft hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 md:self-auto"
            >
              View all clients
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-ink transition-all duration-300 group-hover:bg-aqua">
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <ClientCarousel clients={clients} />
        </Reveal>
      </div>
    </section>
  );
}