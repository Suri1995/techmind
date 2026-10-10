"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { company, services, clients } from "@/lib/data";

type Item = { id: string; label: string; hint: string; run: () => void };

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      { id: "home", label: "Home", hint: "Page", run: go("/") },
      { id: "services", label: "Services", hint: "Page", run: go("/services") },
      { id: "clients", label: "Clients", hint: "Page", run: go("/clients") },
      { id: "about", label: "About", hint: "Page", run: go("/about") },
      { id: "blog", label: "Blog", hint: "Page", run: go("/blog") },
      { id: "careers", label: "Careers", hint: "Page", run: go("/careers") },
      { id: "contact", label: "Discuss your project", hint: "Action", run: go("/contact") },
      {
        id: "mail",
        label: `Email ${company.email}`,
        hint: "Action",
        run: () => (window.location.href = `mailto:${company.email}`),
      },
      {
        id: "call",
        label: `Call ${company.phone}`,
        hint: "Action",
        run: () => (window.location.href = `tel:${company.phone.replace(/\s/g, "")}`),
      },
      ...services.map((s) => ({
        id: `s-${s.slug}`,
        label: s.name,
        hint: "Service",
        run: go(`/services/${s.slug}`),
      })),
      ...clients.map((c) => ({ id: `c-${c.slug}`, label: c.name, hint: "Client", run: go(`/clients/${c.slug}`) })),
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items.slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset palette each time it opens
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function choose(item?: Item) {
    if (!item) return;
    onClose();
    item.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/50 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search and quick navigation"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search pages, services and clients"
                aria-label="Search"
                className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-slate/70"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[0.7rem] text-slate">Esc</kbd>
            </div>
            <ul className="max-h-[22rem] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-slate">
                  Nothing matches &ldquo;{query}&rdquo;. Try a service name or a page.
                </li>
              )}
              {results.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(item)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                      i === active ? "bg-teal-tint text-teal-deep" : "text-ink-soft"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-slate">{item.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
