import { Suspense } from "react";
import type { Metadata } from "next";
import ContactHero from "@/components/heroes/ContactHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";
import { company } from "@/lib/data";
import { IconMail, IconPhone, IconPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Share your project details with Tech.Mind. Our digital marketing team will follow up with the right next steps.",
};

/* ---------- Location (from your Google Maps link) ---------- */
const OFFICE_NAME = "Tech Mind Digital Marketing Agency";
const LAT = 17.3624822;
const LNG = 78.5684163;

// Embed centred on the exact pin, zoomed to street level
const MAP_EMBED = `https://www.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`;
// One-tap turn-by-turn navigation (opens the Maps app on phones)
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
// Opens the business listing itself (reviews, photos, hours)
const LISTING_URL =
  "https://www.google.com/maps?ftid=0x3bcb9fce49e6704b:0x4f43457b059c1a63";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function NavigateIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </svg>
  );
}

export default function ContactPage() {
  const tel = `tel:${company.phone.replace(/\s/g, "")}`;

  return (
    <>
      <ContactHero />

      {/* ───────── Contact details + form ───────── */}
      <section className="wrap grid gap-14 pb-16 pt-16 md:grid-cols-[0.95fr_1.15fr] md:items-start md:gap-20 md:pb-24 md:pt-28">
        {/* Info column */}
        <Reveal>
          <div className="md:sticky md:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
              Get in touch
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
              Reach us directly
            </h2>
            <p className="mt-4 max-w-sm text-slate">
              Prefer to skip the form? Call, write, or stop by — a real person
              picks this up.
            </p>

            <ul className="mt-10 space-y-3">
              {/* Address */}
              <li>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-deep/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-deep/10 text-teal-deep transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
                    <IconPin className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate">
                      Office address
                    </span>
                    <span className="mt-1 block text-base leading-snug text-ink">
                      {company.address}
                    </span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-slate opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-teal-deep group-hover:opacity-100" />
                </a>
              </li>

              {/* Phone */}
              <li>
                <a
                  href={tel}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-deep/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-deep/10 text-teal-deep transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
                    <IconPhone className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate">
                      Phone
                    </span>
                    <span className="mt-1 block text-lg text-ink">
                      {company.phone}
                    </span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-slate opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-teal-deep group-hover:opacity-100" />
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-deep/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-deep/10 text-teal-deep transition-colors duration-300 group-hover:bg-teal-deep group-hover:text-white">
                    <IconMail className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate">
                      Email
                    </span>
                    <span className="mt-1 block truncate text-lg text-ink">
                      {company.email}
                    </span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-slate opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-teal-deep group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Form column */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-paper-raised p-7 shadow-[var(--shadow-soft)] md:p-11">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Tell us about the project
            </h2>
            <p className="mt-3 max-w-md text-slate">
              A few lines about your business and goals is enough to get
              started. Plans are tailored to your business goals, audience, and
              budget.
            </p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-96" aria-hidden />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────── Map / Visit us ───────── */}
      <section className="wrap pb-16 md:pb-28" aria-labelledby="visit-heading">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-soft)]">
            <iframe
              title={`${OFFICE_NAME} location`}
              src={MAP_EMBED}
              className="block h-[480px] w-full md:h-[560px]"
              style={{ border: 0, filter: "grayscale(0.2) contrast(1.03)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating info card: bottom sheet on mobile, top-left panel on desktop */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 md:inset-auto md:left-8 md:top-8 md:w-[23rem] md:p-0">
              <div className="pointer-events-auto rounded-2xl border border-line bg-paper-raised/95 p-6 shadow-[var(--shadow-soft)] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-deep text-white">
                    <IconPin className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                    Visit our office
                  </p>
                </div>

                <h2
                  id="visit-heading"
                  className="mt-4 font-display text-xl leading-snug text-ink"
                >
                  {OFFICE_NAME}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {company.address}
                </p>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:flex-col">
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-deep px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
                  >
                    <NavigateIcon className="h-4 w-4" />
                    Get directions
                  </a>
                  <a
                    href={LISTING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white/60 px-5 py-3 text-sm font-medium text-ink transition-all duration-300 hover:border-teal-deep/50 hover:text-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
                  >
                    Open in Google Maps
                    <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}