"use client";

import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import LeadForm from "@/components/LeadForm";

/* ---------------- hero ----------------
   Mobile  (< 768px):     poster image (home-hero-mobile.png) on top, form below it.
   Tablet  (768–1023px):  full banner image (home-hero-desktop.png) shown uncropped
                          (w-full h-auto), form overlaid on the right side.
   Desktop (>= 1024px):   wide photo as background, copy + buttons on the left,
                          form on the right.
   Both images live in /public.
   The form itself now lives in components/LeadForm.tsx so the Learn More
   popup on the goals carousel can reuse it. */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden lg:flex lg:min-h-[44rem] lg:items-center">
      {/* soft mesh only shows behind the form on mobile */}
      <div className="mesh-hero md:hidden">
        <div className="mesh-grid" />
        <div className="mesh-blob one" />
        <div className="mesh-blob two" />
        <div className="mesh-blob three" />
      </div>

      {/* Background art: only the matching image is downloaded for the screen size */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/home-hero-desktop.png" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home-hero-mobile.png"
          alt=""
          width={1080}
          height={1920}
          loading="eager"
          decoding="async"
          draggable={false}
          className="relative block h-auto w-full md:min-h-[20rem] md:object-cover lg:absolute lg:inset-0 lg:-z-10 lg:h-full lg:object-cover lg:object-[50%_35%]"
        />
      </picture>

      {/* gentle left-side shade so the white copy stays readable (tablet and desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/45 via-black/15 to-transparent md:block lg:from-black/35 lg:via-black/10"
      />

      {/* mobile: stacked | tablet: copy left (50%) + form right (44%) over the image | desktop: 60 / 40 grid */}
      <div className="wrap relative grid grid-cols-1 gap-0 pb-14 pt-6 md:absolute md:inset-0 md:flex md:w-full md:items-center md:justify-between md:gap-6 md:py-0 lg:relative lg:inset-auto lg:grid lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12 lg:py-20 xl:gap-16">
        <div className="md:w-1/2 md:min-w-0 lg:w-auto">
          <Reveal>
            <p className="hidden text-sm font-semibold uppercase leading-tight tracking-wide text-white md:block min-[900px]:text-base lg:text-lg xl:text-xl">
              Tech_Mind
              <br />
              Digital Marketing Agency
            </p>
          </Reveal>

          {/* Mobile: the poster carries the message, so the h1 is for SEO / screen readers only.
              Tablet and up: visible, sized to fit the left half without touching the form. */}
          <Reveal delay={0.15}>
            <h1 className="sr-only font-sans text-4xl font-light leading-[1.15] text-white md:not-sr-only md:mt-4 md:max-w-full md:text-3xl min-[900px]:text-4xl lg:mt-8 lg:max-w-[36rem] lg:text-5xl xl:max-w-[40rem] xl:text-6xl">
              <span className="sr-only">Digital Marketing Agency in Hyderabad: </span>
              The Future of Digital Marketing Is <span className="font-bold">Here</span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            {/* Mobile: two equal buttons between the poster and the form (dark text, light background).
                Tablet: left column, light-on-photo style, compact; wraps to two rows if the column is narrow.
                Desktop: larger version of the same, left-aligned. */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:mb-0 md:mt-5 md:flex md:flex-wrap md:items-center md:gap-3 lg:mt-8 lg:gap-4">
              <Link
                href="/contact"
                className="inline-flex min-w-0 items-center justify-center rounded-2xl border border-teal-deep px-3 py-3 text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.08em] text-teal-deep transition-colors hover:bg-teal-deep hover:text-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 sm:text-xs md:border-teal-200 md:px-5 md:text-[11px] md:tracking-[0.1em] md:text-teal md:hover:bg-teal md:hover:text-ink md:focus-visible:ring-white/30 min-[900px]:text-xs lg:px-8 lg:py-3.5 lg:text-sm lg:tracking-[0.12em]"
              >
                Learn More
              </Link>
            </div>
          </Reveal>
        </div>

        {/* tablet: 44% wide, 86% of the banner height, pinned right */}
        <Reveal delay={0.35} y={20} className="w-full md:h-[86%] md:w-[44%] lg:h-auto lg:w-full">
          <LeadForm variant="hero" idPrefix="hero" />
        </Reveal>
      </div>
    </section>
  );
}