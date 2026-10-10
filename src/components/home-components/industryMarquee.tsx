import { sectors } from "@/lib/data";

export default function IndustryMarquee() {
  return (
    <section className="marquee-pause border-y border-line bg-paper-raised py-6">
      <div className="wrap overflow-hidden">
        <p className="text-sm font-medium text-ink">Trusted by brands in</p>
      </div>
      <div className="mt-3 overflow-hidden">
        <div className="marquee-track flex w-max gap-4 pl-6">
          {[...sectors, ...sectors, ...sectors].map((industry, i) => (
            <span key={i} className="chip shrink-0 rounded-full px-5 py-2 text-base font-medium text-slate md:text-lg">
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
