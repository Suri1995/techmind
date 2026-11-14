"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { services } from "@/lib/data";
import { IconArrowRight } from "@/components/icons";

/* ---------------- form config ---------------- */
const serviceOptions = [...services.map((s) => s.name), "Not sure yet, need advice"];
const budgets = ["Under ₹25,000", "₹25,000 – 50,000", "₹50,000 – 1 lakh", "₹1 lakh and above"];
const timelines = ["As soon as possible", "Within a month", "1 – 3 months", "Just exploring"];
const ease = [0.22, 1, 0.36, 1] as const;

type Data = {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  start: string;
  website: string;
  message: string;
};

const empty: Data = {
  name: "",
  business: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  start: "",
  website: "",
  message: "",
};

type Errors = Partial<Record<keyof Data, string>>;

/* ---------------- hero ----------------
   Mobile  (< 768px):     poster image (home-hero-mobile.png) on top, form below it.
   Tablet  (768–1023px):  full banner image (home-hero-desktop.png) shown uncropped
                          (w-full h-auto), form overlaid on the right side.
   Desktop (>= 1024px):   wide photo as background, copy + buttons on the left,
                          form on the right.
   Both images live in /public. */
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
                href="/about"
                className="inline-flex min-w-0 items-center justify-center rounded-2xl border border-teal-deep px-3 py-3 text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.08em] text-teal-deep transition-colors hover:bg-teal-deep hover:text-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 sm:text-xs md:border-teal-200 md:px-5 md:text-[11px] md:tracking-[0.1em] md:text-teal md:hover:bg-teal md:hover:text-ink md:focus-visible:ring-white/30 min-[900px]:text-xs lg:px-8 lg:py-3.5 lg:text-sm lg:tracking-[0.12em]"
              >
                Learn More
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-w-0 items-center justify-center rounded-2xl border border-ink/70 px-3 py-3 text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 sm:text-xs md:border-white/80 md:px-5 md:text-[11px] md:tracking-[0.1em] md:text-white md:hover:bg-teal md:hover:text-ink md:focus-visible:ring-white/30 min-[900px]:text-xs lg:px-8 lg:py-3.5 lg:text-sm lg:tracking-[0.12em]"
              >
                Request a Consultation
              </Link>
            </div>
          </Reveal>
        </div>

        {/* tablet: 44% wide, 86% of the banner height, pinned right */}
        <Reveal delay={0.35} y={20} className="w-full md:h-[86%] md:w-[44%] lg:h-auto lg:w-full">
          <HeroForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- single-step form ---------------- */
function HeroForm() {
  const [data, setData] = useState<Data>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Wheel scrolling: scroll the form first; once it hits the top or bottom,
  // let the event through so the normal page scroll takes over.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) return; // nothing to scroll
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const canScroll = (e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom);
      // Keep smooth-scroll libraries (Lenis etc.) from swallowing the event;
      // the browser then scrolls this box natively.
      if (canScroll) e.stopPropagation();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [submitted]);

  const set = (k: keyof Data, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validate() {
    const e: Errors = {};
    if (!data.name.trim()) e.name = "Enter your name.";
    if (!data.business.trim()) e.business = "Enter your business or brand.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email.";
    if (data.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid phone number.";
    if (!data.service) e.service = "Choose a service.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      // bring the first invalid field into view inside the scroll area
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>('form [aria-invalid="true"]');
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
        el?.focus({ preventScroll: true });
      }, 0);
      return;
    }
    setSubmitting(true);
    // Demo behaviour: replace this timeout with a POST to your API route or form service.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <div className="relative w-full md:h-full lg:h-auto">
      {/* soft glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-teal/25 via-transparent to-teal-deep/20 blur-3xl"
      />

      {/* gradient hairline border */}
      <div className="rounded-[28px] bg-gradient-to-br from-white via-line to-teal/50 p-px shadow-[var(--shadow-lift)] md:h-full lg:h-auto">
        <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[27px] bg-paper-raised/95 px-6 pb-6 pt-6 backdrop-blur-xl sm:px-7 md:h-full lg:h-[450px]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-teal/10 blur-3xl" />

          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="relative flex h-full flex-col justify-center"
                role="status"
              >
                <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden>
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="23"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease }}
                  />
                  <motion.path
                    d="M15 27l8 8 14-16"
                    fill="none"
                    stroke="var(--teal-deep)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.55, ease }}
                  />
                </svg>
                <h3 className="mt-5 font-display text-2xl text-ink">
                  Thanks, {data.name.split(" ")[0]}. We have your requirements.
                </h3>
                <p className="mt-3 text-slate">
                  Someone from our team will reply to {data.email} within one business day.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex min-h-0 flex-1 flex-col"
              >
                <div className="shrink-0">
                  <h2 className="font-display text-2xl leading-tight text-ink sm:text-[1.7rem]">
                    Project Requirements
                  </h2>
                  <p className="mt-1.5 text-sm text-slate">
                    Tell us a little about your project to get started.
                  </p>
                </div>

                {/* scrollable fields */}
                <div className="relative mt-4 min-h-0 flex-1">
                  <div
                    ref={scrollRef}
                    data-lenis-prevent
                    className="h-full overflow-y-auto overscroll-auto -mx-2 px-2 pb-6 pt-1 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-teal/40"
                  >
                    {/* 1 column on mobile-small, 2 on sm, 1 on tablet (narrow card), 2 on lg+ */}
                    <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      <Field id="name" label="Your name" placeholder="Full name" required autoComplete="name"
                        value={data.name} onChange={(v) => set("name", v)} error={errors.name} />
                      <Field id="business" label="Business / brand" placeholder="Business name" required autoComplete="organization"
                        value={data.business} onChange={(v) => set("business", v)} error={errors.business} />

                      <Field id="email" label="Email" type="email" placeholder="you@company.com" required autoComplete="email"
                        value={data.email} onChange={(v) => set("email", v)} error={errors.email} />
                      <Field id="phone" label="Phone / WhatsApp" type="tel" placeholder="+91" required autoComplete="tel"
                        value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} />

                      <Select id="service" label="Service required" required wide
                        value={data.service} onChange={(v) => set("service", v)} error={errors.service}
                        placeholder="Select a service" options={serviceOptions} />

                      <Select id="budget" label="Approx. monthly budget"
                        value={data.budget} onChange={(v) => set("budget", v)}
                        placeholder="Choose if known" options={budgets} />
                      <Select id="start" label="Expected start"
                        value={data.start} onChange={(v) => set("start", v)}
                        placeholder="Choose timeline" options={timelines} />

                      <Field id="website" label="Website / social profile (optional)" type="url" placeholder="https://" wide
                        value={data.website} onChange={(v) => set("website", v)} />

                      <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                        <label htmlFor="hero-message" className={labelCls}>Tell us about your requirements</label>
                        <textarea
                          id="hero-message"
                          rows={3}
                          value={data.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Your goals, target audience, location, deliverables, or any specific needs..."
                          className={`${inputCls} mt-2 resize-none border-line`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* bottom fade hints that there is more to scroll */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-paper-raised to-transparent" />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine group mt-3 inline-flex shrink-0 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        className="h-3.5 w-3.5 rounded-full border-2 border-paper/40 border-t-paper"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Sending
                    </>
                  ) : (
                    <>
                      Submit Requirements
                      <IconArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- form pieces ---------------- */
const labelCls = "text-sm font-medium text-ink-soft";
const inputCls =
  "w-full rounded-xl border bg-paper px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-slate/60 hover:border-ink/25 focus:border-teal-deep focus:bg-white focus:ring-4 focus:ring-teal/15";

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  placeholder,
  wide,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  const fid = `hero-${id}`;
  return (
    <div className={wide ? "sm:col-span-2 md:col-span-1 lg:col-span-2" : ""}>
      <label className={labelCls} htmlFor={fid}>
        {label}
        {required && <span className="text-teal-deep"> *</span>}
      </label>
      <input
        id={fid}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} mt-2 ${error ? "border-amber" : "border-line"}`}
      />
      {error && <p className="mt-1.5 text-xs text-amber-700" role="alert">{error}</p>}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  wide,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
}) {
  const fid = `hero-${id}`;
  return (
    <div className={wide ? "sm:col-span-2 md:col-span-1 lg:col-span-2" : ""}>
      <label className={labelCls} htmlFor={fid}>
        {label}
        {required && <span className="text-teal-deep"> *</span>}
      </label>
      <div className="relative mt-2">
        <select
          id={fid}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} cursor-pointer appearance-none pr-10 ${value ? "" : "text-slate/60"} ${
            error ? "border-amber" : "border-line"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <IconArrowRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate" />
      </div>
      {error && <p className="mt-1.5 text-xs text-amber-700" role="alert">{error}</p>}
    </div>
  );
}