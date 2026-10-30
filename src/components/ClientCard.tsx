"use client";

import { useState } from "react";
import Image from "next/image";
import type { Client } from "@/lib/data";
import { IconArrowRight } from "./icons";

/** "Feijoa Skin & Hair Clinic" -> "FS", "Srigdha Group" -> "SG" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** "https://www.theparkhotels.com/" -> "theparkhotels.com" */
function domainOf(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function IconTarget({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** Avatar shown when a client has no logo, or the logo file fails to load. */
function AvatarFallback({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name} avatar`}
      className="flex h-20 w-20 select-none items-center justify-center rounded-2xl bg-gradient-to-br from-teal-deep to-teal font-display text-3xl font-semibold tracking-wide text-white shadow-[0_14px_30px_-14px_rgba(15,60,60,0.7)]"
    >
      {initials(name)}
    </div>
  );
}

/**
 * Dark client card: white logo panel with sector chip + visit button,
 * then name, focus line, service tags and a website / partnership footer.
 * Clients without a logo (or whose logo fails to load) get an initials avatar.
 */
export default function ClientCard({
  client,
  className = "",
}: {
  client: Client;
  className?: string;
}) {
  const domain = domainOf(client.website);

  // True when the logo path exists but the image could not be loaded (404, bad name...)
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(client.logo) && !logoFailed;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f1f45] via-[#0a1635] to-[#050b1f] p-3 shadow-[0_24px_50px_-28px_rgba(2,8,30,0.9)] transition-colors duration-300 hover:border-white/25 ${className}`}
    >
      {/* Logo panel */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff_0%,#eef2f7_100%)] sm:h-44">
        {showLogo ? (
          <Image
            src={client.logo as string}
            alt={`${client.name} logo`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 86vw"
            draggable={false}
            onError={() => setLogoFailed(true)}
            className="select-none object-contain px-8 py-7"
          />
        ) : (
          <AvatarFallback name={client.name} />
        )}

        {/* Sector chip */}
        <span className="absolute left-3 top-3 max-w-[calc(100%-4.5rem)] truncate rounded-full bg-[#1c2745] px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {client.sector}
        </span>

        {/* Visit button (only when the client has a website) */}
        {client.website && (
          <a
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${client.name} website (opens in a new tab)`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-[#0a1635] shadow-md transition-all duration-300 hover:bg-teal-deep hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 group-hover:scale-105"
          >
            <IconArrowRight className="h-4 w-4 -rotate-45" />
          </a>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-white">
          {client.name}
        </h3>

        <p className="mt-2.5 flex items-start gap-2.5 text-sm leading-snug text-slate-300">
          <IconTarget className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <span>{client.focus}</span>
        </p>

        <ul className="mb-5 mt-4 flex flex-wrap gap-1.5">
          {client.tags.map((t) => (
            <li
              key={t}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] font-medium text-slate-300"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="flex min-w-0 items-center gap-2.5 text-sm text-slate-300">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                domain
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-slate-500"
              }`}
            />
            <span className="truncate">{domain ?? "Website coming soon"}</span>
          </span>

          <span
            title={
              client.ongoing
                ? "Ongoing partnership"
                : `Partnership: ${client.partnership}`
            }
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${
              client.ongoing
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-amber/15 text-amber"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                client.ongoing ? "bg-emerald-400" : "bg-amber"
              }`}
            />
            {client.ongoing ? "Ongoing" : client.partnership}
          </span>
        </div>
      </div>
    </article>
  );
}