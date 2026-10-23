"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { company } from "@/lib/data";
import { IconArrowRight } from "./icons";
import CommandPalette from "./CommandPalette";

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Premium contact icons (filled, local to this file)                  */
/* ------------------------------------------------------------------ */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

/* One dock button: glossy circle that opens into a labelled pill on hover/focus */
type ContactKind = "phone" | "whatsapp";

type DockProps = {
  kind: ContactKind;
  label: string;
  aria: string;
  gradient: string;
  glow: string;
  icon: React.ReactNode;
  delay: number;
  active: boolean;
  onClick: () => void;
};

function DockButton({ label, aria, gradient, glow, icon, delay, active, onClick }: DockProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`relative h-14 w-14 shrink-0 hover:z-20 focus-within:z-20 ${active ? "contact-active-button" : ""}`}
      initial={reduce ? false : { opacity: 0, scale: 0.5, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 18, delay }}
    >
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-full"
            style={{ border: `1.5px solid ${glow}` }}
            animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay: i * 1.2 + delay }}
          />
        ))}

      <motion.button
        type="button"
        aria-label={aria}
        aria-expanded={active}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.4), inset 0 -8px 16px rgba(0,0,0,.12), 0 14px 34px -10px ${glow}`,
        }}
        className={`group absolute right-0 top-0 flex h-14 w-14 flex-row-reverse items-center overflow-hidden rounded-full text-white transition-[width] duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:w-[12.5rem] focus-visible:w-[12.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${gradient}`}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
        <span className="relative grid h-14 w-14 shrink-0 place-items-center">{active ? <span className="text-3xl font-light leading-none">×</span> : icon}</span>
        <span className="relative flex min-w-0 translate-x-3 flex-col whitespace-nowrap pl-5 text-left leading-tight opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          <span className="text-sm font-semibold tracking-tight">{label}</span>
          <span className="text-[11px] font-medium text-white/80">Click to open</span>
        </span>
      </motion.button>
    </motion.div>
  );
}

function ContactPopup({ kind, phone, onClose }: { kind: ContactKind; phone: string; onClose: () => void }) {
  const isPhone = kind === "phone";
  return (
    <motion.section
      role="dialog"
      aria-label={isPhone ? "Call options" : "WhatsApp options"}
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.94 }}
      className={`contact-popup ${isPhone ? "contact-popup-phone" : "contact-popup-whatsapp"}`}
    >
      <header>
        <div>
          <strong>{isPhone ? "Call Tech.Mind" : "Chat with Tech.Mind"}</strong>
        </div>
      </header>
      <div className="contact-popup-body">
        {isPhone ? (
          <a href={`tel:${phone.replace(/\\s/g, "")}`} className="contact-option">
            <span className="contact-option-icon"><PhoneGlyph className="h-5 w-5" /></span>
            <span><strong>{phone}</strong></span>
          </a>
        ) : (
          <>
            <p className="contact-welcome">Hi! How can we help you today?</p>
            <a href={`https://wa.me/${phone.replace(/\\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="contact-option contact-option-whatsapp">
              <span>General enquiries</span><WhatsAppGlyph className="h-5 w-5" />
            </a>
          </>
        )}
      </div>
    </motion.section>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState<ContactKind | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 700);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <div className="floating-actions">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25, ease }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-raised text-ink-soft shadow-[var(--shadow-soft)] transition-colors hover:border-teal-deep hover:text-teal-deep"
            >
              <IconArrowRight className="h-4 w-4 -rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search the site (Ctrl or Command + K)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex h-11 items-center gap-2 rounded-full border border-line bg-paper-raised px-4 text-sm font-medium text-ink-soft shadow-[var(--shadow-soft)] transition-colors hover:border-teal-deep hover:text-teal-deep"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-line px-1.5 text-[0.65rem] text-slate sm:inline">⌘K</kbd>
        </motion.button>
      </div>

      <div className={`contact-actions flex w-14 flex-col items-end gap-4 ${contactOpen ? "contact-actions-open" : ""}`}>
        <AnimatePresence>
          {contactOpen && <ContactPopup kind={contactOpen} phone={company.phone} onClose={() => setContactOpen(null)} />}
        </AnimatePresence>
        <DockButton
          kind="whatsapp"
          label="Chat on WhatsApp"
          aria="Open WhatsApp contact options"
          gradient="bg-[linear-gradient(135deg,#4ff08f_0%,#25d366_45%,#0f9e6e_100%)]"
          glow="rgba(37,211,102,0.75)"
          delay={0.1}
          active={contactOpen === "whatsapp"}
          onClick={() => setContactOpen(contactOpen === "whatsapp" ? null : "whatsapp")}
          icon={<WhatsAppGlyph className="h-[26px] w-[26px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />}
        />
        <DockButton
          kind="phone"
          label="Call us now"
          aria="Open phone contact options"
          gradient="bg-[linear-gradient(135deg,#34e0cc_0%,#14b8a6_45%,#0b5f58_100%)]"
          glow="rgba(20,184,166,0.8)"
          delay={0.22}
          active={contactOpen === "phone"}
          onClick={() => setContactOpen(contactOpen === "phone" ? null : "phone")}
          icon={
            <motion.span
              className="grid place-items-center"
              style={{ transformOrigin: "50% 50%" }}
              animate={reduce ? undefined : { rotate: [0, -14, 12, -10, 8, -4, 0] }}
              transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5 }}
            >
              <PhoneGlyph className="h-[24px] w-[24px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
            </motion.span>
          }
        />
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
