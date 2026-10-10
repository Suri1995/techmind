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
              description="Ongoing partnerships across real estate, healthcare, jewellery, hospitality, wellness, farming, and pet training."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/clients" className="link-underline inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-teal-deep">
              View all clients
              <IconArrowRight className="h-4 w-4" />
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