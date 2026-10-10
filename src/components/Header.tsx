"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { company } from "@/lib/data";
import { IconArrowRight, IconPhone } from "./icons";

// Primary wayfinding — the routes people navigate between most.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/about", label: "About" },
];

// Secondary, lower-frequency links — tucked into the utility strip on desktop.
const utilityLinks = [
  { href: "/blog", label: "Blog" },
];

// Mobile has no separate strip, so everything reads as one ordered list.
const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the mobile menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Header always stays visible; scrolling only toggles the compact/blurred style.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measured height is only used to position the mobile menu overlay.
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeaderHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        {/* Utility strip — Blog / Careers. Collapses out of the way on scroll. */}
        <motion.div
          className="hidden overflow-hidden bg-gradient-to-r from-[#031416] to-[#123a3c] text-paper/65 lg:block"
          animate={{ height: scrolled ? 0 : 38 }}
          initial={false}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="wrap flex h-[38px] items-center justify-end gap-5 text-[0.8rem] font-medium tracking-[0.01em]">
            {utilityLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-5">
                {i > 0 && <span className="h-3 w-px bg-paper/15" aria-hidden="true" />}
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-paper ${
                    pathname === link.href ? "text-paper" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
            <span className="h-3 w-px bg-paper/15" aria-hidden="true" />
            <Link href="/careers" className="transition-colors hover:text-paper">
              Careers
            </Link>
          </div>
        </motion.div>

        {/* Primary nav */}
        <div
          className={`relative border-b transition-[background-color,box-shadow,border-color] duration-300 ${
            scrolled
              ? "border-[#123a3c]/10 bg-[#f4f8f7]/85 shadow-[0_8px_30px_-12px_rgba(3,20,22,0.35)] backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-[#f4f8f7]"
          }`}
        >
          {/* hairline sheen along the top edge — a single, deliberate accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#123a3c]/25 to-transparent" />

          <div
            className={`wrap flex items-center justify-between transition-[height] duration-300 ${
              scrolled ? "h-16" : "h-[4.5rem] md:h-20"
            }`}
          >
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${company.name} home`}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="block"
              >
                <Image
                  src="/techmind-logo.png"
                  alt={company.name}
                  width={180}
                  height={52}
                  priority
                  className="h-16 w-auto transition-all duration-300 md:h-14"
                />
              </motion.span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {navLinks.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors ${
                      active
                        ? "text-paper"
                        : "text-[#123a3c]/75 hover:bg-[#123a3c]/[0.06] hover:text-[#123a3c]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-[#123a3c] shadow-[0_4px_14px_-4px_rgba(18,58,60,0.55)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 rounded-full border border-[#123a3c]/15 bg-white/40 px-4 py-2.5 text-sm font-medium text-[#123a3c]/85 transition-colors hover:border-[#123a3c]/25 hover:bg-white/70"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <IconPhone className="h-4 w-4" />
                {company.phone}
              </a>
              <Link
                href="/contact"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-[#123a3c] px-5 py-2.5 text-sm font-semibold text-paper shadow-[0_6px_20px_-6px_rgba(18,58,60,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#0b2a2c] hover:shadow-[0_10px_24px_-6px_rgba(18,58,60,0.65)]"
              >
                Discuss Your Project
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block h-4 w-6" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-6 bg-[#123a3c] transition-transform ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-[1.5px] w-6 bg-[#123a3c] transition-opacity ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-[1.5px] w-6 bg-[#123a3c] transition-transform ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-[#f4f8f7]/95 backdrop-blur-2xl lg:hidden"
              style={{ top: headerHeight || "4.5rem" }}
            >
              <motion.nav
                className="wrap flex flex-col gap-1 py-8 md:py-10"
                aria-label="Mobile"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {mobileLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between border-b border-[#123a3c]/12 py-4 font-display text-2xl transition-colors md:text-3xl ${
                        pathname === link.href ? "text-[#123a3c]" : "text-[#123a3c]/70 hover:text-[#123a3c]"
                      }`}
                    >
                      {link.label}
                      <IconArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href="/contact"
                    className="group flex items-center justify-between border-b border-[#123a3c]/12 py-4 font-display text-2xl text-[#123a3c] md:text-3xl"
                  >
                    Contact
                    <IconArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="mt-6 flex items-center gap-2 text-sm font-medium text-[#123a3c]/70"
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <IconPhone className="h-4 w-4" />
                  {company.phone}
                </motion.a>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Constant-height spacer (expanded header size) so page content never
          sits under the fixed header and doesn't jump when it compacts. */}
      <div className="h-[4.5rem] md:h-20 lg:h-[calc(5rem+38px)]" aria-hidden="true" />
    </>
  );
}