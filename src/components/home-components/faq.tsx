"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { faqs } from "@/lib/data";



type Props = {
  items?: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  description?: string;
  id?: string;
};

export default function FAQ({
  items = faqs,
  eyebrow = "Questions",
  title = "Questions businesses ask before they start.",
  description = "If yours isn't here, send it over and we'll reply within one business day.",
  id,
}: Props = {}) {
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id={id} className="scroll-mt-32 border-t border-line bg-paper-raised py-16 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="border-b border-line">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-t border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span
                        className={`font-display text-lg transition-colors duration-300 md:text-xl ${
                          isOpen ? "text-teal-deep" : "text-ink group-hover:text-teal-deep"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                          isOpen
                            ? "border-teal-deep bg-teal-deep text-paper"
                            : "border-line text-ink-soft group-hover:border-teal-deep"
                        }`}
                        aria-hidden
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <motion.span
                          className="absolute h-3.5 w-px bg-current"
                          animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-6 leading-relaxed text-slate">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
