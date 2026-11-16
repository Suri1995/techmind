"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/lib/data";
import { IconArrowRight } from "@/components/icons";

/**
 * LeadForm: the "Project Requirements" form, shared by the Hero and the
 * Learn More popup.
 * Suggested location:  components/LeadForm.tsx
 *
 * variant="hero"  -> the sizing the hero already uses (mobile / tablet / desktop)
 * variant="modal" -> fits inside a popup (max ~38rem tall, never taller than the screen)
 *
 * idPrefix keeps input ids unique when two forms exist on one page.
 * Email is optional; phone is the one required way to reach the visitor.
 */

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

type Props = {
  variant?: "hero" | "modal";
  /** Prefix for input ids, so two forms on one page never share ids. */
  idPrefix?: string;
  /** id for the form's <h2>, used by a dialog's aria-labelledby. */
  headingId?: string;
  /** When set, the thank-you state shows a Done button that calls this. */
  onDone?: () => void;
};

/* ---------------- single-step form ---------------- */
export default function LeadForm({
  variant = "hero",
  idPrefix = "hero",
  headingId,
  onDone,
}: Props) {
  const isModal = variant === "modal";
  const [data, setData] = useState<Data>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* layout classes that differ between the hero and the popup */
  const gridCls = isModal
    ? "grid gap-x-4 gap-y-4 sm:grid-cols-2"
    : "grid gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2";
  const wideCls = isModal
    ? "sm:col-span-2"
    : "sm:col-span-2 md:col-span-1 lg:col-span-2";

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
    // email is optional, but if it is filled in it must look right
    if (data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      e.email = "Enter a valid email.";
    }
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
        const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
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
    <div className={isModal ? "relative w-full" : "relative w-full md:h-full lg:h-auto"}>
      {/* soft glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-teal/25 via-transparent to-teal-deep/20 blur-3xl"
      />

      {/* gradient hairline border */}
      <div
        className={`rounded-[28px] bg-gradient-to-br from-white via-line to-teal/50 p-px shadow-[var(--shadow-lift)] ${
          isModal ? "" : "md:h-full lg:h-auto"
        }`}
      >
        <div
          className={`relative flex flex-col overflow-hidden rounded-[27px] bg-paper-raised/95 px-6 pb-6 pt-6 backdrop-blur-xl sm:px-7 ${
            isModal
              ? "h-[min(38rem,calc(100dvh-5rem))]"
              : "h-[450px] md:h-full lg:h-[450px]"
          }`}
        >
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
                  Thanks, {data.name.trim().split(" ")[0]}. We have your requirements.
                </h3>
                <p className="mt-3 text-slate">
                  {data.email.trim()
                    ? `Someone from our team will reply to ${data.email.trim()} within one business day.`
                    : `Someone from our team will contact you on ${data.phone.trim()} within one business day.`}
                </p>
                {onDone && (
                  <button
                    type="button"
                    onClick={onDone}
                    className="mt-6 inline-flex w-fit items-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30"
                  >
                    Done
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={submit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex min-h-0 flex-1 flex-col"
              >
                <div className={`shrink-0 ${isModal ? "pr-8" : ""}`}>
                  <h2
                    id={headingId}
                    className="font-display text-2xl leading-tight text-ink sm:text-[1.7rem]"
                  >
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
                    <div className={gridCls}>
                      <Field idPrefix={idPrefix} id="name" label="Your name" placeholder="Full name" required autoComplete="name"
                        value={data.name} onChange={(v) => set("name", v)} error={errors.name} />
                      <Field idPrefix={idPrefix} id="business" label="Business / brand" placeholder="Business name" required autoComplete="organization"
                        value={data.business} onChange={(v) => set("business", v)} error={errors.business} />

                      <Field idPrefix={idPrefix} id="email" label="Email (optional)" type="email" placeholder="you@company.com" autoComplete="email"
                        value={data.email} onChange={(v) => set("email", v)} error={errors.email} />
                      <Field idPrefix={idPrefix} id="phone" label="Phone / WhatsApp" type="tel" placeholder="+91" required autoComplete="tel"
                        value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} />

                      <Select idPrefix={idPrefix} id="service" label="Service required" required wideCls={wideCls}
                        value={data.service} onChange={(v) => set("service", v)} error={errors.service}
                        placeholder="Select a service" options={serviceOptions} />

                      <Select idPrefix={idPrefix} id="budget" label="Approx. monthly budget"
                        value={data.budget} onChange={(v) => set("budget", v)}
                        placeholder="Choose if known" options={budgets} />
                      <Select idPrefix={idPrefix} id="start" label="Expected start"
                        value={data.start} onChange={(v) => set("start", v)}
                        placeholder="Choose timeline" options={timelines} />

                      <Field idPrefix={idPrefix} id="website" label="Website / social profile (optional)" type="url" placeholder="https://" wideCls={wideCls}
                        value={data.website} onChange={(v) => set("website", v)} />

                      <div className={wideCls}>
                        <label htmlFor={`${idPrefix}-message`} className={labelCls}>Tell us about your requirements</label>
                        <textarea
                          id={`${idPrefix}-message`}
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
  idPrefix,
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  placeholder,
  wideCls,
}: {
  idPrefix: string;
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  wideCls?: string;
}) {
  const fid = `${idPrefix}-${id}`;
  return (
    <div className={wideCls ?? ""}>
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
  idPrefix,
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  wideCls,
}: {
  idPrefix: string;
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  required?: boolean;
  wideCls?: string;
}) {
  const fid = `${idPrefix}-${id}`;
  return (
    <div className={wideCls ?? ""}>
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