import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceDetailHero from "@/components/heroes/ServiceDetailHero";
import SectionNav from "@/components/SectionNav";
import SectionHeading from "@/components/SectionHeading";
import ServiceArt from "@/components/ServiceArt";
import FAQ from "@/components/home-components/faq";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { getService, services, clients, tagInfo } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: service.name, description: `${service.tagline} ${service.short}` };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === slug);
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];
  const related = service.related.map((r) => getService(r)!).filter(Boolean);
  const usedBy = clients.filter((c) => c.tags.some((t) => tagInfo[t]?.service === slug));

  const nav = [
    { id: "overview", label: "Overview" },
    { id: "included", label: "What's included" },
    { id: "process", label: "How it works" },
    { id: "outcomes", label: "What you can expect" },
    ...(usedBy.length ? [{ id: "clients", label: "Where we do this" }] : []),
    { id: "faq", label: "FAQs" },
  ];

  return (
    <>
      <ServiceDetailHero service={service} />
      <SectionNav items={nav} />

      {/* Overview */}
      <section id="overview" className="wrap scroll-mt-32 grid gap-12 py-16 md:grid-cols-[1.25fr_0.75fr] md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Overview" title={service.tagline} />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate md:text-lg">
            {service.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="spot-card rounded-3xl border border-line bg-paper-raised p-7 shadow-[var(--shadow-soft)] md:sticky md:top-36">
            <h3 className="font-display text-xl text-ink">Best suited to</h3>
            <ul className="mt-5 space-y-3.5">
              {service.bestFor.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Included */}
      <section id="included" className="scroll-mt-32 border-y border-line bg-paper-raised py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <SectionHeading eyebrow="What's included" title={`Everything that goes into ${service.name}.`} description="Each engagement is shaped around your goals, audience and budget. These are the building blocks we draw from." />
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {service.included.map((item, i) => (
              <RevealItem key={item.title}>
                <div className="spot-card card-lift h-full rounded-3xl border border-line bg-paper p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-tint text-sm font-bold text-teal-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="relative scroll-mt-32 overflow-hidden bg-ink py-16 text-paper md:py-24">
        <div className="mesh-hero mesh-dark">
          <div className="mesh-grid on-ink" />
          <div className="mesh-blob one" />
        </div>
        <div className="noise-overlay" />
        <div className="wrap relative">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="A clear path from first call to ongoing results." tone="paper" />
          </Reveal>
          <RevealGroup className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6" stagger={0.1}>
            {service.process.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="border-t-2 border-amber pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber">
                    {String(i + 1).padStart(2, "0")} / {step.title.split(" ")[0]}
                  </span>
                  <h3 className="mt-3 font-display text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-on-ink">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Outcomes + channels */}
      <section id="outcomes" className="wrap scroll-mt-32 grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="What you can expect" title="Practical outcomes, honestly reported." />
          <ul className="mt-8 space-y-4">
            {service.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-base text-ink-soft">
                <IconCheck className="mt-1 h-5 w-5 shrink-0 text-teal-deep" />
                {o}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-paper-raised p-8 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-xl text-ink">Channels and formats</h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {service.channels.map((c) => (
                <li key={c} className="rounded-full border border-line bg-mist px-4 py-2 text-sm font-medium text-ink-soft">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate">
              We align the right channels with your goals, then learn and optimize as campaigns develop.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Clients using this service */}
      {usedBy.length > 0 && (
        <section id="clients" className="scroll-mt-32 border-t border-line bg-paper-raised py-16 md:py-24">
          <div className="wrap">
            <Reveal>
              <SectionHeading eyebrow="Where we do this" title={`Clients we support with ${service.name}.`} />
            </Reveal>
            <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {usedBy.map((c) => (
                <RevealItem key={c.slug}>
                  <Link href={`/clients/${c.slug}`} className="card-lift spot-card group flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5">
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-teal-deep">{c.sector}</span>
                      <span className="mt-1 block font-display text-lg text-ink group-hover:text-teal-deep">{c.name}</span>
                    </span>
                    <IconArrowRight className="h-4 w-4 shrink-0 text-slate transition-transform group-hover:translate-x-1 group-hover:text-teal-deep" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <FAQ id="faq" items={service.faqs} eyebrow="FAQs" title={`${service.name}: common questions.`} description="Anything else? Send us your question and we'll reply within one business day." />

      {/* Related */}
      <section className="wrap py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Works well with" title="Services that pair naturally with this one." />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-3" stagger={0.08}>
          {related.map((r) => (
            <RevealItem key={r.slug}>
              <Link href={`/services/${r.slug}`} className="card-lift group block overflow-hidden rounded-3xl border border-line bg-paper-raised">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ServiceArt slug={r.slug} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="mt-2 font-display text-xl text-ink group-hover:text-teal-deep">{r.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{r.short}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Final CTA + prev/next */}
      <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-24">
        <div className="mesh-hero mesh-dark">
          <div className="mesh-blob one" />
          <div className="mesh-blob two" />
        </div>
        <div className="noise-overlay" />
        <Reveal className="wrap relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">Ready when you are</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            Share a few details about your {service.name} requirements.
          </h2>
          <p className="mt-4 max-w-xl text-slate-on-ink">Our team can follow up with the right next steps. Plans are tailored to your business goals, audience, and budget.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={`/contact?service=${service.slug}`} className="btn-shine inline-flex items-center gap-2 rounded-full bg-teal px-8 py-4 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-colors hover:bg-paper">
              Submit requirements
              <IconArrowRight className="h-4 w-4 -rotate-45" />
            </Link>
          </div>
          <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
            {[{ label: "Previous service", s: prev, dir: "prev" }, { label: "Next service", s: next, dir: "next" }].map(({ label, s, dir }) => (
              <Link key={dir} href={`/services/${s.slug}`} className={`group flex items-center gap-4 rounded-2xl glass-dark p-5 transition-colors hover:border-aqua/50 ${dir === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                <IconArrowRight className={`h-5 w-5 shrink-0 text-aqua transition-transform ${dir === "prev" ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                <span>
                  <span className="block text-xs uppercase tracking-wide text-slate-on-ink">{label}</span>
                  <span className="mt-1 block font-display text-lg">{s.name}</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
