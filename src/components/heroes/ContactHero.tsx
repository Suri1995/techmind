"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import HeroCrumbs from "./HeroCrumbs";
import { IconCheck, IconMail, IconPhone, IconPin } from "@/components/icons";
import { company } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

function useStudioStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hour12: false,
        weekday: "short",
        timeZone: "Asia/Kolkata",
      }).formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === "hour")?.value);
      const day = parts.find((p) => p.type === "weekday")?.value;
      const open = day !== "Sun" && hour >= 10 && hour < 19;
      setStatus({
        open,
        label: open ? "Online now · usually replies within the hour" : "Offline · we reply first thing at 10 AM IST",
      });
    };
    compute();
    const id = window.setInterval(compute, 60000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

/** Vivid teal hero whose cards do real work: copy the email, call, or open the studio on a map. */
export default function ContactHero() {
  const status = useStudioStatus();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(company.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = company.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const cardBase =
    "group flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.16]";

  return (
    <section className="relative overflow-hidden bg-teal-deep pb-16 pt-12 text-paper md:pb-24 md:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_85%_20%,rgba(103,232,214,0.45),transparent_65%),radial-gradient(60%_70%_at_0%_100%,#031416,transparent_70%)]" />
      <motion.div
        aria-hidden
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/15"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-44 -top-44 h-[34rem] w-[34rem] rounded-full border border-white/10"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.08, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <div className="noise-overlay" />

      <div className="wrap relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <HeroCrumbs tone="dark" crumbs={[{ href: "/contact", label: "Contact" }]} />
          <div className="flex items-center gap-2.5 text-sm font-medium text-aqua" aria-live="polite">
            <span className="relative flex h-2 w-2">
              {status?.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-70" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${status?.open ? "bg-aqua" : "bg-amber"}`} />
            </span>
            {status ? status.label : "Contact us"}
          </div>
          <h1 className="mt-5 max-w-xl font-display text-[2.5rem] leading-[1.06] sm:text-5xl md:text-[3.6rem]">
            <WordReveal text="Let's talk about what you're building." stagger={0.07} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="mt-6 max-w-md text-lg leading-relaxed text-paper/80"
          >
            Send us a few details and we&apos;ll set up a short call — no pressure, no generic pitch deck.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { delayChildren: 0.5, staggerChildren: 0.12 } } }}
          className="space-y-3"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}>
            <button type="button" onClick={copyEmail} className={cardBase} aria-label={`Copy ${company.email}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <IconMail className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-paper/70">Email</span>
                <span className="block truncate font-medium">{company.email}</span>
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "c" : "n"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"
                  role="status"
                >
                  {copied ? (
                    <>
                      <IconCheck className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    "Copy"
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.div>

          <motion.a
            variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className={cardBase}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <IconPhone className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-xs text-paper/70">Call</span>
              <span className="block font-medium">{company.phone}</span>
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Dial</span>
          </motion.a>

          <motion.a
            variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cardBase}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <IconPin className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-paper/70">Visit the studio</span>
              <span className="block truncate font-medium">{company.mapsQuery}</span>
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Map</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
