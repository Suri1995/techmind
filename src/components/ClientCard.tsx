"use client";

import { IconArrowRight } from "./icons";
import type { Client } from "@/lib/data";

/** Navy header band, partnership badge, focus line and service tags. */
export default function ClientCard({ client, className = "" }: { client: Client; className?: string }) {
  return (
    <article
      className={`card-lift spot-card group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper-raised ${className}`}
    >
      <div className="hero-dark relative flex h-28 items-end justify-between px-6 pb-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
        <div className="hero-beam" />
        <span className="relative text-amber">{client.sector}</span>
        <span className="relative text-slate-on-ink">Client project</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-ink transition-colors group-hover:text-teal-deep">{client.name}</h3>
        </div>
        <span
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            client.ongoing ? "bg-teal-tint text-teal-deep" : "bg-amber/15 text-[#8a5a12]"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${client.ongoing ? "bg-teal" : "bg-amber"}`} />
          {client.ongoing ? "Ongoing partnership" : `Partnership: ${client.partnership}`}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-slate">{client.summary}</p>
        <p className="mt-4 text-sm font-semibold text-ink">
          <span className="font-bold">Focus:</span> {client.focus}
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {client.tags.map((t) => (
            <li key={t} className="rounded-md bg-mist px-2.5 py-1 text-[0.7rem] font-medium text-slate">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
