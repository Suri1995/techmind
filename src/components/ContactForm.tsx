"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { getService, services } from "@/lib/data";
import { IconArrowRight, IconCheck } from "./icons";

/* ---------------- config (same inputs as the hero form) ---------------- */
const serviceOptions = [...services.map((s) => s.name), "Not sure yet, need advice"];
const budgets = ["Under ₹25,000", "₹25,000 – 50,000", "₹50,000 – 1 lakh", "₹1 lakh and above"];
const timelines = ["As soon as possible", "Within a month", "1 – 3 months", "Just exploring"];

const steps = [
  {
    label: "About you",
    title: "Let's start with you",
    hint: "So we know who to reply to.",
  },
  {
    label: "Your needs",
    title: "What do you need help with?",
    hint: "Pick the closest match. We'll refine it together on a call.",
  },
  {
    label: "Details",
    title: "Anything else we should know?",
    hint: "Optional, but it helps us come prepared.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;
const MESSAGE_MAX = 600;

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

/* ---------------- contact form (multi-step) ---------------- */
export default function ContactForm() {
  const params = useSearchParams();
  const preset = getService(params.get("service") ?? "")?.name ?? "";
  const reduce = useReducedMotion();

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Data>({ ...empty, service: preset });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const last = steps.length - 1;

  /* Smoothly animate the card height to match whichever step is showing. */
  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [submitted]);

  /* Move focus to the new step's heading so keyboard and screen-reader users land in the right place. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 260);
    return () => window.clearTimeout(t);
  }, [step]);

  const set = (k: keyof Data, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function focusFirstInvalid() {
    const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]');
    if (!el) return;
    const target = el.matches("input, select, textarea, button")
      ? el
      : el.querySelector<HTMLElement>("input, button");
    target?.focus({ preventScroll: true });
    (target ?? el).scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }

  function validate(s: number) {
    const e: Errors = {};
    if (s === 0) {
      if (!data.name.trim()) e.name = "Enter your name.";
      if (!data.business.trim()) e.business = "Enter your business or brand.";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email.";
      if (data.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid phone number.";
    }
    if (s === 1 && !data.service) e.service = "Choose a service to continue.";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      window.setTimeout(focusFirstInvalid, 0);
      return false;
    }
    return true;
  }

  function next() {
    if (!validate(step)) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, last));
  }

  function goTo(i: number) {
    if (i >= step) return; // only completed steps are reachable
    setDir(-1);
    setErrors({});
    setStep(i);
  }

  function back() {
    goTo(step - 1);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    // Pressing Enter on an earlier step moves forward instead of submitting.
    if (step < last) {
      next();
      return;
    }
    if (!validate(step)) return;
    setSubmitting(true);
    // Demo behaviour: replace this timeout with a POST to your API route or form service.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  function reset() {
    setData({ ...empty, service: preset });
    setErrors({});
    setStep(0);
    setDir(1);
    firstRender.current = true;
    setSubmitted(false);
  }

  /* ---------------- success ---------------- */
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease }}
        className="relative w-full"
        role="status"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 ring-1 ring-teal/30">
          <svg viewBox="0 0 52 52" className="h-10 w-10" aria-hidden>
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduce ? 0 : 0.7, ease }}
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
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.55, ease }}
            />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-2xl text-ink sm:text-3xl">
          Thanks, {data.name.split(" ")[0]}. We have your requirements.
        </h3>
        <p className="mt-3 max-w-md text-slate">
          Someone from our team will reply to <span className="font-medium text-ink">{data.email}</span> within one
          business day to set up a short call.
        </p>

        <dl className="mt-7 grid gap-x-8 gap-y-4 rounded-2xl border border-line bg-paper p-5 text-sm sm:grid-cols-2">
          <Summary label="Service" value={data.service} />
          <Summary label="Business" value={data.business} />
          <Summary label="Monthly budget" value={data.budget || "Not shared"} />
          <Summary label="Expected start" value={data.start || "Not shared"} />
        </dl>

        <button
          type="button"
          onClick={reset}
          className="link-underline mt-6 text-sm font-semibold text-ink-soft hover:text-teal-deep"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  /* ---------------- step animation ---------------- */
  const slide: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -24 }),
  };

  const current = steps[step];

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="w-full">
      {/* Progress */}
      <ol className="grid grid-cols-3 gap-3" aria-label="Form progress">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const body = (
            <>
              <span className="relative block h-1 w-full overflow-hidden rounded-full bg-line">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-teal to-teal-deep"
                  initial={false}
                  animate={{ scaleX: done ? 1 : active ? 0.5 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease }}
                />
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                    done
                      ? "border-teal-deep bg-teal-deep text-paper"
                      : active
                        ? "border-teal-deep text-teal-deep"
                        : "border-line text-slate"
                  }`}
                >
                  {done ? <IconCheck className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={`truncate text-xs sm:text-sm ${active ? "font-semibold text-ink" : done ? "text-ink-soft" : "text-slate"}`}
                >
                  {s.label}
                </span>
              </span>
            </>
          );
          return (
            <li key={s.label} aria-current={active ? "step" : undefined}>
              {done ? (
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go back to ${s.label}`}
                  className="block w-full rounded-md text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
                >
                  {body}
                </button>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Step content. The wrapper animates its height to fit each step. */}
      <div
        className="-mx-3 -my-3 mt-3 overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
        style={{ height }}
      >
        <div ref={innerRef} className="p-3">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.26, ease }}
              className="pt-5"
            >
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-xl leading-tight text-ink outline-none sm:text-2xl"
              >
                {current.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate">{current.hint}</p>

              <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                {step === 0 && (
                  <>
                    <Field id="name" label="Your name" placeholder="Full name" required autoComplete="name"
                      icon={<IconUser />} value={data.name} onChange={(v) => set("name", v)} error={errors.name} />
                    <Field id="business" label="Business / brand" placeholder="Business name" required autoComplete="organization"
                      icon={<IconBriefcase />} value={data.business} onChange={(v) => set("business", v)} error={errors.business} />
                    <Field id="email" label="Email" type="email" inputMode="email" placeholder="you@company.com" required autoComplete="email"
                      icon={<IconMailSm />} value={data.email} onChange={(v) => set("email", v)} error={errors.email} />
                    <Field id="phone" label="Phone / WhatsApp" type="tel" inputMode="tel" placeholder="+91" required autoComplete="tel"
                      icon={<IconPhoneSm />} value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="sm:col-span-2">
                      <ChipGroup name="service" legend="Service required" required options={serviceOptions}
                        value={data.service} onChange={(v) => set("service", v)} error={errors.service} />
                    </div>
                    <div className="sm:col-span-2">
                      <ChipGroup name="budget" legend="Approx. monthly budget" optional options={budgets}
                        value={data.budget} onChange={(v) => set("budget", v)} />
                    </div>
                    <div className="sm:col-span-2">
                      <ChipGroup name="start" legend="Expected start" optional options={timelines}
                        value={data.start} onChange={(v) => set("start", v)} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-sm sm:col-span-2">
                      <span className="text-slate">Your brief:</span>
                      <Pill>{data.service}</Pill>
                      {data.budget && <Pill>{data.budget}</Pill>}
                      {data.start && <Pill>{data.start}</Pill>}
                      <button
                        type="button"
                        onClick={() => goTo(1)}
                        className="link-underline ml-auto text-sm font-semibold text-teal-deep"
                      >
                        Edit
                      </button>
                    </div>

                    <Field id="website" label="Website / social profile" optional type="url" inputMode="url"
                      placeholder="https://" autoComplete="url" wide icon={<IconGlobe />}
                      value={data.website} onChange={(v) => set("website", v)} />

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className={labelCls}>
                        Tell us about your requirements <span className="font-normal text-slate">(optional)</span>
                      </label>
                      <div className="relative mt-2">
                        <textarea
                          id="contact-message"
                          rows={5}
                          maxLength={MESSAGE_MAX}
                          value={data.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Your goals, target audience, location, deliverables, or any specific needs..."
                          className={`${inputCls} resize-none border-line pb-9`}
                        />
                        <span className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums text-slate/70">
                          {data.message.length}/{MESSAGE_MAX}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-teal-deep border-2 border-ink-soft hover:border-teal-deep p-2 rounded-3xl"
          >
            <IconArrowRight className="h-4 w-4 rotate-180" />
            Back
          </button>
        ) : (
          <span className="text-xs text-slate">We reply within one business day.</span>
        )}

        {/*
          Distinct keys matter here: without them React reuses the same <button> DOM node when
          swapping "Continue" (type="button") for "Submit" (type="submit"), and the click that
          reaches the last step can submit the form immediately.
        */}
        {step < last ? (
          <button
            key="continue"
            type="button"
            onClick={next}
            className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
          >
            Continue
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={submitting}
            className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 disabled:opacity-70"
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
        )}
      </div>
    </form>
  );
}

/* ---------------- form pieces ---------------- */
const labelCls = "text-sm font-medium text-ink-soft";
const inputCls =
  "w-full rounded-xl border bg-paper px-4 py-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-slate/50 hover:border-ink/25 focus:border-teal-deep focus:bg-white focus:ring-4 focus:ring-teal/15";

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-paper-raised px-3 py-1 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-amber-700" role="alert">
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  type = "text",
  inputMode,
  value,
  onChange,
  error,
  required,
  optional,
  autoComplete,
  placeholder,
  wide,
  icon,
}: {
  id: string;
  label: string;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
  icon?: ReactNode;
}) {
  const fid = `contact-${id}`;
  const eid = `${fid}-error`;
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className={labelCls} htmlFor={fid}>
        {label}
        {required && <span className="text-teal-deep"> *</span>}
        {optional && <span className="font-normal text-slate"> (optional)</span>}
      </label>
      <div className="group relative mt-2">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate transition-colors group-focus-within:text-teal-deep"
          >
            {icon}
          </span>
        )}
        <input
          id={fid}
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? eid : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} ${icon ? "pl-11" : ""} ${error ? "border-amber" : "border-line"}`}
        />
      </div>
      {error && <ErrorText id={eid}>{error}</ErrorText>}
    </div>
  );
}

/* Selectable chips built on real radio inputs, so arrow keys and Tab work natively. */
function ChipGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  required,
  optional,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
}) {
  const labelId = `contact-${name}-label`;
  const eid = `contact-${name}-error`;
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-required={required || undefined}
      aria-describedby={error ? eid : undefined}
      data-invalid={error ? "true" : undefined}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className={labelCls}>
          {legend}
          {required && <span className="text-teal-deep"> *</span>}
          {optional && <span className="font-normal text-slate"> (optional)</span>}
        </span>
        {optional && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-medium text-slate transition-colors hover:text-teal-deep"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <label key={o} className="relative cursor-pointer">
              <input
                type="radio"
                name={name}
                value={o}
                checked={active}
                onChange={() => onChange(o)}
                className="peer sr-only"
              />
              <span
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-teal/30 ${
                  active
                    ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                    : `bg-paper text-ink-soft hover:border-teal-deep hover:text-teal-deep ${
                        error ? "border-amber" : "border-line"
                      }`
                }`}
              >
                {active && <IconCheck className="h-3.5 w-3.5" />}
                {o}
              </span>
            </label>
          );
        })}
      </div>
      {error && <ErrorText id={eid}>{error}</ErrorText>}
    </div>
  );
}

/* ---------------- small inline icons ---------------- */
function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
const IconUser = () => (
  <Svg>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);
const IconBriefcase = () => (
  <Svg>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);
const IconMailSm = () => (
  <Svg>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Svg>
);
const IconPhoneSm = () => (
  <Svg>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);
const IconGlobe = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);