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

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="wrap grid gap-14 py-16 md:grid-cols-[0.95fr_1.15fr] md:gap-20 md:py-28">
        {/* Info column — a quiet directory rather than a row of matching cards */}
        <Reveal>
          <div className="md:sticky md:top-28">
            <h2 className="font-display text-2xl text-ink">Reach us directly</h2>
            <p className="mt-3 max-w-sm text-slate">
              Prefer to skip the form? Call, write, or stop by — a real person picks this up.
            </p>

            <div className="mt-10 border-t border-line">
              <div className="flex items-start gap-4 border-b border-line py-6">
                <IconPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" />
                <div>
                  <p className="text-xs font-medium text-slate">Office address</p>
                  <p className="mt-1.5 text-lg leading-snug text-ink">{company.address}</p>
                </div>
              </div>

              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 border-b border-line py-6 transition-colors hover:border-teal-deep/40"
              >
                <IconPhone className="h-5 w-5 shrink-0 text-teal-deep" />
                <div>
                  <p className="text-xs font-medium text-slate">Phone</p>
                  <p className="mt-1.5 text-lg text-ink transition-colors group-hover:text-teal-deep">
                    {company.phone}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="group flex items-center gap-4 border-b border-line py-6 transition-colors hover:border-teal-deep/40"
              >
                <IconMail className="h-5 w-5 shrink-0 text-teal-deep" />
                <div>
                  <p className="text-xs font-medium text-slate">Email</p>
                  <p className="mt-1.5 text-lg text-ink transition-colors group-hover:text-teal-deep">
                    {company.email}
                  </p>
                </div>
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Tech.Mind office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  company.mapsQuery
                )}&output=embed`}
                width="100%"
                height="240"
                style={{ border: 0, filter: "grayscale(0.15) contrast(1.02)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>

        {/* Form column */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-line bg-paper-raised p-7 shadow-[var(--shadow-soft)] md:p-11">
            <h2 className="font-display text-2xl text-ink">Tell us about the project</h2>
            <p className="mt-2 max-w-md text-slate">
              A few lines about your business and goals is enough to get started. Plans are tailored to your business goals, audience, and budget.
            </p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-96" aria-hidden />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}