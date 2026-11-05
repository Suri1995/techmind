"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import Magnetic from "@/components/motion/Magnetic";
import ServiceImage from "@/components/ServiceImage";
import { IconArrowRight } from "@/components/icons";
import HeroCrumbs from "./HeroCrumbs";
import { getServiceVisual, type Service } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

/** Dark hero for a single service: copy and quick facts on the left, tilting artwork on the right. */
export default function ServiceDetailHero({ service }: { service: Service }) {
  const reduce = !!useReducedMotion();
  const visual = getServiceVisual(service.slug);

  /* tilt + parallax + glare (mouse only) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotX = useTransform(sy, (v) => v * -8);
  const rotY = useTransform(sx, (v) => v * 10);
  const gx = useTransform(sx, (v) => (v + 0.5) * 100);
  const gy = useTransform(sy, (v) => (v + 0.5) * 100);
  const glareOn = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 45%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    glareOn.set(1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    glareOn.set(0);
  };

  const facts = [
    { value: service.included.length, label: "deliverables" },
    { value: service.process.length, label: "step process" },
    { value: service.channels.length, label: "channels" },
  ];

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease },
        };

  return (
    <section className="hero-dark relative overflow-hidden pb-14 pt-10 text-paper md:pb-24 md:pt-16">
      <div className="mesh-hero mesh-dark">
        <div className="mesh-grid on-ink hero-grid-fade" />
        <div className="mesh-blob one" />
      </div>
      <div className="hero-beam" />
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* accent glow tied to this service */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${visual.accent}88, transparent 65%)` }}
      />

      <div className="wrap relative grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12">
        {/* ───────── copy ───────── */}
        <div>
          <HeroCrumbs
            tone="dark"
            crumbs={[
              { href: "/services", label: "Services" },
              { href: `/services/${service.slug}`, label: service.name },
            ]}
          />

          {/* <motion.span
            {...fade(0.1)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: visual.accent }} />
            Service {service.number}
          </motion.span> */}

          <h1 className="mt-4 font-display text-[2rem] leading-[1.1] sm:text-5xl md:text-[3.2rem]">
            <WordReveal text={service.name} stagger={0.07} />
          </h1>

          <motion.p {...fade(0.45)} className="mt-5 max-w-xl text-lg leading-relaxed text-paper/90">
            {service.tagline}
          </motion.p>
          <motion.p {...fade(0.55)} className="mt-3 max-w-xl text-base leading-relaxed text-slate-on-ink">
            {service.short}
          </motion.p>

          <motion.div {...fade(0.7)} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Magnetic>
              <Link
                href={`/contact?service=${service.slug}`}
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-aqua px-6 py-3.5 text-sm font-semibold text-ink shadow-[var(--shadow-lift)] transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30 sm:px-7 sm:py-4"
              >
                Submit requirements
                <IconArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:border-aqua hover:text-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/30 sm:px-7 sm:py-4"
            >
              All services
            </Link>
          </motion.div>

          <motion.dl {...fade(0.85)} className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="glass-dark rounded-2xl px-4 py-3">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-2xl text-paper">{f.value}</span>
                  <span className="mt-0.5 block text-xs text-slate-on-ink">{f.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ───────── artwork ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="min-w-0"
        >
          <div className="pb-3 pr-3 sm:pb-5 sm:pr-5">
            <motion.div
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{
                rotateX: reduce ? 0 : rotX,
                rotateY: reduce ? 0 : rotY,
                transformPerspective: 1200,
              }}
              className="relative"
            >
              {/* offset back plate for depth */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[18px] border border-white/10 bg-white/[0.05] sm:translate-x-5 sm:translate-y-5 sm:rounded-[24px]"
              />

              <div className="relative aspect-[2/1] overflow-hidden rounded-[18px] border border-white/20 bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:rounded-[24px]">
                <ServiceImage
                  slug={service.slug}
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                />

                {/* one light sweep on load */}
                {!reduce && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-120%" }}
                    animate={{ x: "420%" }}
                    transition={{ duration: 1.2, delay: 0.9, ease }}
                  />
                )}

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{ background: glare, opacity: glareOn }}
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>

              {/* floating chip */}
              <motion.div
                className="absolute -top-3 left-3 flex items-center gap-2 rounded-full border border-white/25 bg-ink/80 px-3 py-1.5 text-xs font-semibold text-paper shadow-lg backdrop-blur-xl sm:left-5"
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: visual.accent }} />
                {service.channels.slice(0, 2).join(" · ")}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}