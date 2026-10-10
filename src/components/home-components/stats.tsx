import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import { stats } from "@/lib/data";

export default function Stats() {
  return (
    <section className="wrap py-16 md:py-24">
      <RevealGroup
        className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-line bg-paper-raised shadow-[var(--shadow-soft)] md:grid-cols-4"
        stagger={0.12}
      >
        {stats.map((stat, i) => (
          <RevealItem
            key={stat.label}
            className={`spot-card group relative p-7 md:p-9 ${
              i % 2 === 1 ? "border-l border-line" : ""
            } ${i > 0 ? "md:border-l md:border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}
          >
            <Counter
              value={stat.value}
              className="font-display text-5xl text-ink transition-colors duration-500 group-hover:text-teal-deep md:text-6xl"
            />
            <p className="mt-3 max-w-[14rem] text-sm leading-snug text-slate">{stat.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
