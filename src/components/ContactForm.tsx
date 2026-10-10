"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { getService, services } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconCheck } from "./icons";

const projectTypes = [...services.map((x) => x.name), "Not sure yet, need advice"];

const budgets = ["Under ₹5 lakh", "₹5 – 15 lakh", "₹15 – 40 lakh", "₹40 lakh and above"];
const timelines = ["As soon as possible", "Within 3 months", "3 – 6 months", "Just exploring"];

const steps = ["About you", "Your needs", "Details"];
const ease = [0.22, 1, 0.36, 1] as const;

type Data = {
  name: string;
  email: string;
  company: string;
  phone: string;
  type: string;
  budget: string;
  timeline: string;
  message: string;
};

const empty: Data = {
  name: "",
  email: "",
  company: "",
  phone: "",
  type: "",
  budget: "",
  timeline: "",
  message: "",
};

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const params = useSearchParams();
  const preset = getService(params.get("service") ?? "")?.name ?? "";
  const [data, setData] = useState<Data>({ ...empty, type: preset });
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof Data, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validate(s: number) {
    const e: typeof errors = {};
    if (s === 0) {
      if (!data.name.trim()) e.name = "Enter your name so we know who to reply to.";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email, like name@company.com.";
    }
    if (s === 1 && !data.type) e.type = "Choose the service closest to what you need.";
    if (s === 2 && data.message.trim().length < 10)
      e.message = "Add a sentence or two about your business and goals.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setDir(1);
    setStep((s) => s + 1);
  }
  function back() {
    setDir(-1);
    setStep((s) => s - 1);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!validate(2)) return;
    setSubmitting(true);
    // Demo behaviour: replace this timeout with a POST to your API route or form service.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative overflow-hidden rounded-3xl border border-line bg-paper-raised p-8 shadow-[var(--shadow-soft)] md:p-10"
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
        <h3 className="mt-5 font-display text-2xl text-ink">Thanks, {data.name.split(" ")[0]}. We have your brief.</h3>
        <p className="mt-3 max-w-md text-slate">
          Someone from our team will reply to {data.email} within one business day to set up a short call.
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <Summary label="Service" value={data.type} />
          <Summary label="Budget" value={data.budget || "Not shared"} />
          <Summary label="Timeline" value={data.timeline || "Not shared"} />
          <Summary label="Company" value={data.company || "Not shared"} />
        </dl>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-paper-raised p-6 shadow-[var(--shadow-soft)] md:p-9">
      {/* Progress */}
      <ol className="flex items-center gap-3" aria-label="Form progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3" aria-current={i === step ? "step" : undefined}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                i < step
                  ? "border-teal-deep bg-teal-deep text-paper"
                  : i === step
                    ? "border-teal-deep text-teal-deep"
                    : "border-line text-slate"
              }`}
            >
              {i < step ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={`hidden text-sm sm:block ${i === step ? "font-semibold text-ink" : "text-slate"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="relative h-px flex-1 bg-line">
                <motion.span
                  className="absolute inset-0 origin-left bg-teal-deep"
                  initial={false}
                  animate={{ scaleX: i < step ? 1 : 0 }}
                  transition={{ duration: 0.5, ease }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 min-h-[22rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.3, ease }}
            className="space-y-5"
          >
            {step === 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" value={data.name} onChange={(v) => set("name", v)} error={errors.name} required autoComplete="name" />
                  <Field label="Work email" type="email" value={data.email} onChange={(v) => set("email", v)} error={errors.email} required autoComplete="email" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Company" value={data.company} onChange={(v) => set("company", v)} autoComplete="organization" />
                  <Field label="Phone" type="tel" value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <ChipGroup
                  legend="Which service do you need?"
                  options={projectTypes}
                  value={data.type}
                  onChange={(v) => set("type", v)}
                  error={errors.type}
                />
                <ChipGroup legend="Estimated budget" options={budgets} value={data.budget} onChange={(v) => set("budget", v)} optional />
              </>
            )}

            {step === 2 && (
              <>
                <ChipGroup legend="When do you want to start?" options={timelines} value={data.timeline} onChange={(v) => set("timeline", v)} optional />
                <div>
                  <label className="text-sm font-medium text-ink-soft" htmlFor="message">
                    Tell us about the project <span className="text-teal-deep">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={data.message}
                    onChange={(e) => set("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    placeholder="Tell us about your business, your goals and anything you have tried so far."
                    className={`mt-2 w-full rounded-xl border bg-paper-raised px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-teal-deep focus:ring-2 focus:ring-teal/20 ${
                      errors.message ? "border-amber" : "border-line"
                    }`}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-amber-700" role="alert">{errors.message}</p>}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={back} className="link-underline text-sm font-semibold text-ink-soft hover:text-teal-deep">
            Back
          </button>
        ) : (
          <span className="text-xs text-slate">Takes about a minute</span>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep"
          >
            Continue
            <IconArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper shadow-[var(--shadow-lift)] transition-colors hover:bg-teal-deep disabled:opacity-70"
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
                Send brief
                <IconArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}

function ChipGroup({
  legend,
  options,
  value,
  onChange,
  error,
  optional,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-soft">
        {legend} {optional && <span className="font-normal text-slate">(optional)</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(active && optional ? "" : opt)}
              className={`relative rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                active
                  ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]"
                  : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-xs text-amber-700" role="alert">{error}</p>}
    </fieldset>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className="text-sm font-medium text-ink-soft" htmlFor={id}>
        {label}
        {required && <span className="text-teal-deep"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border bg-paper-raised px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-teal-deep focus:ring-2 focus:ring-teal/20 ${
          error ? "border-amber" : "border-line"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-amber-700" role="alert">{error}</p>}
    </div>
  );
}
