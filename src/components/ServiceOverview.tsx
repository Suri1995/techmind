import Link from "next/link";
import ServiceArt from "./ServiceArt";
import Reveal from "./motion/Reveal";
import { IconArrowRight, IconCheck } from "./icons";
import type { Service } from "@/lib/data";

/** One service on the listing page: illustration, summary, highlights, link through to the detail page. */
export default function ServiceOverview({ service, index }: { service: Service; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <div id={service.slug} className="scroll-mt-32 border-t border-line py-14 first:border-t-0 first:pt-0 md:py-20">
      <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}>
        <Reveal y={24}>
          <Link
            href={`/services/${service.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)]"
            aria-label={`Explore ${service.name}`}
          >
            <ServiceArt slug={service.slug} className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md">
              Service {service.number}
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-deep">{service.number}</span>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{service.name}</h2>
          <p className="mt-3 font-display text-lg leading-snug text-teal-deep">{service.tagline}</p>
          <p className="mt-4 leading-relaxed text-slate">{service.description[0]}</p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {service.included.slice(0, 4).map((item) => (
              <li key={item.title} className="flex items-start gap-2 text-sm text-ink-soft">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
                {item.title}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={`/services/${service.slug}`}
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep"
            >
              Explore {service.name.split(" ").slice(0, 2).join(" ")}
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/contact?service=${service.slug}`}
              className="link-underline text-sm font-semibold text-ink-soft hover:text-teal-deep"
            >
              Submit requirements ↗
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
