import Link from "next/link";
import CareersHero from "@/components/heroes/CareersHero";

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <section className="wrap grid gap-8 py-16 md:grid-cols-[1fr_0.7fr] md:items-start md:py-24">
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-slate">
            There are no open roles at the moment, but we welcome exceptional people. Tell us what you do best and where you could make an impact.
          </p>
          <Link href="/contact" className="btn-shine mt-8 inline-flex items-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep">
            Introduce yourself
          </Link>
        </div>
        <div className="border-t border-line pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-deep">What we value</p>
          <p className="mt-4 font-display text-2xl leading-tight text-ink">Curiosity, craft, candour, and a bias toward making things better.</p>
        </div>
      </section>
    </>
  );
}
