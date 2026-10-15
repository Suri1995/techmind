"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { company, services } from "@/lib/data";
import FooterNewsletter from "./FooterNewsletter";
import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconPin,
  IconLinkedIn,
  IconTwitter,
  IconInstagram,
} from "./icons";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const shortName = (name: string) =>
  name
    .replace("Cinema Graphics & Video Editing", "Video & Graphics")
    .replace("Complete Performance Marketing", "Performance Marketing");

const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = services.map((s) => ({
  href: `/services/${s.slug}`,
  label: shortName(s.name),
}));

// Replace the "#" hrefs with your real profile URLs.
const socials = [
  { icon: IconLinkedIn, label: "LinkedIn", href: "#" },
  { icon: IconTwitter, label: "Twitter / X", href: "#" },
  { icon: IconInstagram, label: "Instagram", href: "#" },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/* Magnetic: element gently follows the cursor, springs back on leave  */
/* ------------------------------------------------------------------ */
function Magnetic({
  children,
  strength = 0.3,
  className = "inline-block",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.25 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* SpotlightCard: glass panel whose border + surface glow follows the  */
/* cursor                                                              */
/* ------------------------------------------------------------------ */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const glow = useMotionTemplate`radial-gradient(380px circle at ${x}px ${y}px, rgba(20,184,166,0.12), transparent 70%)`;
  const edge = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(45,212,191,0.65), transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={`group/card relative rounded-[28px] p-px ${className}`}
    >
      {/* resting hairline border */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/15 via-white/[0.05] to-white/[0.02]" />
      {/* cursor-lit border */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: edge }}
      />
      {/* surface */}
      <div className="relative overflow-hidden rounded-[27px] bg-[#071518]/95 p-6 backdrop-blur-xl sm:p-10">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: glow }}
        />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/* Link with a slide-in underline and a small nudge on hover */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link relative inline-flex w-fit items-center text-sm text-slate-on-ink transition-all duration-300 hover:translate-x-1.5 hover:text-paper focus-visible:text-paper focus-visible:outline-none"
    >
      <span className="absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 scale-0 rounded-full bg-teal shadow-[0_0_10px_2px_rgba(20,184,166,0.6)] transition-transform duration-300 group-hover/link:scale-100 group-focus-visible/link:scale-100" />
      <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-teal after:to-transparent after:transition-transform after:duration-300 group-hover/link:after:scale-x-100 group-focus-visible/link:after:scale-x-100">
        {children}
      </span>
    </Link>
  );
}

/* Column heading with a soft accent rule */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-tight text-paper">{children}</h3>
      <span className="mt-3 block h-px w-10 bg-gradient-to-r from-teal to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MapCard: dark, teal-tinted live map with address + directions CTA   */
/* ------------------------------------------------------------------ */
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=17.3624822,78.5684163&z=16&output=embed";
const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir//Tech+Mind+Digital+Marketing+Agency,+Road+No.+2,+Mamatha+Nagar,+Nagole,+Hyderabad,+Telangana+500068/@17.388187,78.5448963,6731m/data=!3m1!1e3!4m9!4m8!1m0!1m5!1m1!1s0x3bcb9fce49e6704b:0x4f43457b059c1a63!2m2!1d78.5684163!2d17.3624822!3e9";

function MapCard() {
  return (
    <a
      href={MAP_DIRECTIONS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get directions to ${company.name}, ${company.address}`}
      className="group/map relative block overflow-hidden rounded-2xl bg-[#071518] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-inset ring-white/10 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_rgba(20,184,166,0.35)] hover:ring-teal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      {/* map */}
      <div className="relative h-40 overflow-hidden">
        {/* iframe is shifted up to crop Google's place card; bottom stays for attribution */}
        <iframe
          title={`Map showing ${company.name}`}
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[90px] h-[calc(100%+90px)] w-full border-0 opacity-80 transition-all duration-700 [filter:invert(92%)_hue-rotate(180deg)_saturate(0.55)_brightness(0.85)_contrast(0.95)] group-hover/map:scale-105 group-hover/map:opacity-100"
        />

        {/* teal tint + soft vignette so the map blends into the footer */}
        <div className="pointer-events-none absolute inset-0 bg-teal/20 mix-blend-color" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071518]/50 via-transparent to-[#071518]/30" />

        {/* radar pulse on the pin location */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(50%-45px)] -translate-x-1/2 -translate-y-1/2"
        >
          <span className="block h-10 w-10 rounded-full bg-teal/30 motion-safe:animate-ping" />
        </span>

        {/* floating badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#071518]/70 px-3 py-1.5 text-[11px] font-medium text-paper ring-1 ring-inset ring-white/15 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
          </span>
          Our office
        </span>
      </div>

      {/* address + CTA */}
      <div className="flex items-start gap-3 border-t border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
        <div className="min-w-0 flex-1">
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-teal">
            Get directions
            <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/map:translate-x-1" />
          </span>
        </div>
      </div>
    </a>
  );
}

/* Icon chip used in the contact column */
const chip =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover/row:bg-teal/15 group-hover/row:ring-teal/50";

export default function Footer() {
  const reduce = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Cursor spotlight that follows the pointer across the footer
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mx}px ${my}px, rgba(20,184,166,0.12), transparent 70%)`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${company.email}`;
    }
  }

  const reveal = reduce
    ? {}
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.15 } };

  return (
    <footer
      ref={footerRef}
      onMouseMove={(e) => {
        if (reduce || !footerRef.current) return;
        const r = footerRef.current.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative isolate overflow-hidden border-t border-line-dark bg-ink text-paper"
    >
      {/* ambient layers */}
      <div className="noise-overlay" />

      {/* faint dot grid that fades out toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_30%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* top edge: hairline + soft glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal/[0.07] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-teal/60 blur-sm" />

      {/* aurora blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-teal/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-40 h-96 w-96 rounded-full bg-[#123a3c]/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-teal/[0.06] blur-[110px]" />

      {/* cursor spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: spotlight }}
      />

      {/* ---------------- 3. Main grid ----------------
          lg+: 300px brand | 1fr Company | 1fr Services | 320px Get in touch */}
      <motion.div
        className="wrap relative grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)_320px] lg:gap-10"
        variants={container}
        {...reveal}
      >
        {/* Brand */}
        <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/techmind-logo.png"
            alt={company.name}
            width={180}
            height={52}
            className="h-9 w-auto brightness-0 invert md:h-10"
          />
          <p className="mt-6 max-w-full text-[15px] leading-[1.75] text-slate-on-ink">
            Complete digital marketing solutions that help businesses strengthen visibility,
            generate enquiries, build customer relationships, and grow online.
          </p>
          <div className="mt-8 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <Magnetic key={label} strength={0.5}>
                <a
                  href={href}
                  aria-label={label}
                  className="group/social relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/[0.03] text-slate-on-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/10 backdrop-blur-sm transition-all duration-300 hover:text-[#031416] hover:shadow-[0_8px_28px_-6px_rgba(20,184,166,0.7)] hover:ring-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-gradient-to-br from-teal to-[#5eead4] transition-transform duration-300 ease-out group-hover/social:translate-y-0" />
                  <Icon className="relative h-4 w-4" />
                </a>
              </Magnetic>
            ))}
          </div>
        </motion.div>

        {/* Company */}
        <motion.div
          variants={item}
          className="lg:border-l lg:border-white/[0.07] lg:pl-8"
        >
          <ColumnHeading>Company</ColumnHeading>
          <ul className="mt-6 flex flex-col gap-3.5 pl-4">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div
          variants={item}
          className="lg:border-l lg:border-white/[0.07] lg:pl-8"
        >
          <ColumnHeading>Services</ColumnHeading>
          <ul className="mt-6 flex flex-col gap-3.5 pl-4">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={item}
          className="lg:border-l lg:border-white/[0.07] lg:pl-8"
        >
          <ColumnHeading>Get in touch</ColumnHeading>
          <ul className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-slate-on-ink">
            <li>
              <MapCard />
            </li>
            <li className="group/row flex items-center gap-3.5">
              <span className={chip}>
                <IconPhone className="h-4 w-4" />
              </span>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-paper focus-visible:text-paper focus-visible:outline-none"
              >
                {company.phone}
              </a>
            </li>
            <li className="group/row flex items-center gap-3.5">
              <span className={chip}>
                <IconMail className="h-4 w-4" />
              </span>
              <a
                href={`mailto:${company.email}`}
                title={company.email}
                aria-label={`Email us at ${company.email}`}
                className="min-w-0 flex-1 whitespace-nowrap transition-colors hover:text-paper focus-visible:text-paper focus-visible:outline-none"
              >
                Email us
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="relative flex h-8 min-w-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.03] px-3 text-xs font-medium text-paper/80 ring-1 ring-inset ring-white/10 transition-all duration-300 hover:bg-teal/10 hover:text-teal hover:ring-teal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={copied ? "text-teal" : ""}
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* ---------------- 5. Wordmark ---------------- */}
      <div
        className="wrap relative [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]"
        aria-hidden="true"
      >
        <motion.p
          className="flex select-none justify-between font-display text-[17vw] leading-[0.85] tracking-tight lg:text-[14rem]"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          {...reveal}
        >
          {"Tech.Mind".split("").map((char, i) => (
            <span key={i} className="overflow-hidden pb-[0.12em]">
              <motion.span
                className="block cursor-default transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_28px_rgba(45,212,191,0.45))]"
                variants={{
                  hidden: { y: "105%" },
                  visible: { y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                whileHover={reduce ? undefined : { y: "-4%", transition: { duration: 0.25 } }}
                style={{
                  backgroundImage: "var(--grad-accent-light)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  opacity: 0.92,
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </motion.p>
      </div>

      {/* ---------------- 6. Bottom bar ---------------- */}
      <div className="relative border-t border-white/[0.07] bg-black/25 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent" />
        <div className="wrap flex flex-col gap-4 py-6 text-xs leading-relaxed text-slate-on-ink sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {company.name}. All
            rights reserved.
          </p>
          <p className="sm:ml-auto">Strategy | Creativity | Performance</p>
        </div>
      </div>
    </footer>
  );
}