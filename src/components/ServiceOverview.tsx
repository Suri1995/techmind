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
import Reveal from "@/components/motion/Reveal";
import ServiceImage from "@/components/ServiceImage";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { getServiceVisual, type Service } from "@/lib/data";

/**
 * One block on the /services page. Images alternate left / right.
 * The wrapper carries id={slug} so the sticky ServiceNav can highlight it while scrolling.
 */
export default function ServiceOverview({ service, index }: { service: Service; index: number }) {
  const reduce = useReducedMotion();
  const visual = getServiceVisual(service.slug);
  const flip = index % 2 === 1;

  /* tilt + glare (mouse only) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotX = useTransform(sy, (v) => v * -7);
  const rotY = useTransform(sx, (v) => v * 9);
  const gx = useTransform(sx, (v) => (v + 0.5) * 100);
  const gy = useTransform(sy, (v) => (v + 0.5) * 100);
  const glareOn = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(460px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 45%)`;

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

  const extraChannels = Math.max(0, service.channels.length - 6);

  return (
    <article
      id={service.slug}
      className="scroll-mt-40 border-t border-line py-12 first:border-t-0 first:pt-0 md:py-20"
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ───────── image ───────── */}
        <Reveal className={flip ? "lg:order-2" : ""}>
          <div className="group relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-[36px] opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: `radial-gradient(circle at 50% 50%, ${visual.accent}, transparent 70%)` }}
            />
            <motion.div
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{
                rotateX: reduce ? 0 : rotX,
                rotateY: reduce ? 0 : rotY,
                transformPerspective: 1200,
              }}
              className="relative aspect-[2/1] overflow-hidden rounded-[22px] border border-line shadow-[var(--shadow-lift)] sm:rounded-[28px]"
            >
              <ServiceImage
                slug={service.slug}
                sizes="(min-width: 1024px) 560px, 100vw"
                imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: glare, opacity: glareOn }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

              <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold tabular-nums text-paper backdrop-blur-md sm:left-4 sm:top-4">
                {service.number}
              </span>
              <span className="absolute bottom-3 right-3 hidden rounded-full border border-white/25 bg-ink/75 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-md sm:block sm:bottom-4 sm:right-4">
                {service.channels.length} channels
              </span>
            </motion.div>
          </div>
        </Reveal>

        {/* ───────── content ───────── */}
        <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-deep">
            <span className="rounded-full bg-teal-tint px-3 py-1">{service.included.length} deliverables</span>
            <span className="rounded-full bg-teal-tint px-3 py-1">{service.process.length}-step process</span>
          </div>

          <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">{service.name}</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{service.tagline}</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate">{service.short}</p>

          <ul className="mt-6 space-y-3">
            {service.bestFor.slice(0, 3).map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
                {b}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {service.channels.slice(0, 6).map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-mist px-3.5 py-1.5 text-xs font-medium text-ink-soft"
              >
                {c}
              </li>
            ))}
            {extraChannels > 0 && (
              <li className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-xs font-medium text-slate">
                +{extraChannels} more
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={`/services/${service.slug}`}
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
            >
              View details
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/contact?service=${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-teal-deep hover:text-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
            >
              Submit requirements
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}