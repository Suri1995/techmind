import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientDetailHero from "@/components/heroes/ClientDetailHero";
import SectionHeading from "@/components/SectionHeading";
import ClientCard from "@/components/ClientCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import CTA from "@/components/home-components/cta";
import { IconArrowRight } from "@/components/icons";
import { clients, getClient, getService, tagInfo } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams() {
  return clients.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getClient(slug);
  return c ? { title: c.name, description: `${c.summary} Focus: ${c.focus}.` } : {};
}

export default async function ClientPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();

  const i = clients.findIndex((c) => c.slug === slug);
  const others = [clients[(i + 1) % clients.length], clients[(i + 2) % clients.length]];

  return (
    <>
      <ClientDetailHero client={client} />

      <section className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
        <Reveal>
          <SectionHeading eyebrow="The partnership" title={client.focus} />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate md:text-lg">
            {client.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-paper-raised p-7 shadow-[var(--shadow-soft)] md:sticky md:top-28">
            <h3 className="font-display text-xl text-ink">Work in play</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {client.tags.map((t) => (
                <li key={t} className="rounded-md bg-mist px-2.5 py-1 text-xs font-medium text-slate">{t}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate">
              {client.ongoing
                ? "This is an ongoing partnership, with strategy and execution reviewed regularly."
                : `Partnership duration: ${client.partnership}.`}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-paper-raised py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeading eyebrow="How we support them" title="The services behind the partnership." description="Each area links to a full breakdown of what the service includes and how it works." />
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {client.tags.map((t) => {
              const info = tagInfo[t];
              const svc = info ? getService(info.service) : undefined;
              return (
                <RevealItem key={t}>
                  <Link href={svc ? `/services/${svc.slug}` : "/services"} className="spot-card card-lift group block h-full rounded-3xl border border-line bg-paper p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-deep">{svc ? `Service ${svc.number}` : "Service"}</span>
                    <h3 className="mt-3 font-display text-xl text-ink group-hover:text-teal-deep">{t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{info?.text}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
                      {svc?.name}
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="wrap py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="More partnerships" title="Other brands we work with." />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2" stagger={0.08}>
          {others.map((c) => (
            <RevealItem key={c.slug}>
              <ClientCard client={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <CTA />
    </>
  );
}
