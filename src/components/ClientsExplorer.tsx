"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClientCard from "./ClientCard";
import { clients, sectors } from "@/lib/data";

const allTags = Array.from(new Set(clients.flatMap((c) => c.tags))).sort();

export default function ClientsExplorer() {
  const [sector, setSector] = useState("All");
  const [tag, setTag] = useState<string | null>(null);

  const list = useMemo(
    () => clients.filter((c) => (sector === "All" || c.sector === sector) && (!tag || c.tags.includes(tag))),
    [sector, tag],
  );

  const pill = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
      on ? "border-teal-deep bg-teal-deep text-paper shadow-[var(--shadow-soft)]" : "border-line text-slate hover:border-teal-deep hover:text-teal-deep"
    }`;

  return (
    <div>
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate">Industry</p>
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by industry">
            {["All", ...sectors].map((s) => (
              <button key={s} role="tab" aria-selected={sector === s} onClick={() => setSector(s)} className={pill(sector === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate">Service in play</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(tag === t ? null : t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  tag === t ? "bg-ink text-paper" : "bg-mist text-slate hover:bg-teal-tint hover:text-teal-deep"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate" aria-live="polite">
        Showing {list.length} of {clients.length} clients
      </p>

      <motion.div layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => (
            <motion.div
              key={c.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ClientCard client={c} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-xl text-ink">No clients match those filters yet.</p>
          <button
            onClick={() => {
              setSector("All");
              setTag(null);
            }}
            className="mt-4 rounded-full border border-teal-deep px-5 py-2 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-deep hover:text-paper"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
