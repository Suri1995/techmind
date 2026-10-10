import Link from "next/link";
import type { Metadata } from "next";
import ServicesHero from "@/components/heroes/ServicesHero";
import SectionHeading from "@/components/SectionHeading";
import ServiceNav from "@/components/ServiceNav";
import ServiceOverview from "@/components/ServiceOverview";
import Reveal from "@/components/motion/Reveal";
import { services } from "@/lib/data";
import { IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Meta Ads, Google Ads, SEO, influencer marketing, video and graphics, websites and apps, web applications and complete performance marketing, under one roof.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceNav services={services} />

      <section className="wrap py-16 md:py-24">
        {services.map((service, i) => (
          <ServiceOverview key={service.slug} service={service} index={i} />
        ))}
      </section>

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
    </>
  );
}
