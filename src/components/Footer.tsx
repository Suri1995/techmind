import Link from "next/link";
import Image from "next/image";
import { company, services } from "@/lib/data";
import FooterNewsletter from "./FooterNewsletter";
import {
  IconMail,
  IconPhone,
  IconPin,
  IconLinkedIn,
  IconTwitter,
  IconInstagram,
} from "./icons";

const columns = [
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/services", label: "Services" },
      { href: "/clients", label: "Clients" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Services",
    links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.name.replace("Cinema Graphics & Video Editing", "Video & Graphics").replace("Complete Performance Marketing", "Performance Marketing") })),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-ink text-paper">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal to-transparent" />
      <div className="noise-overlay" />
      <div className="wrap relative grid gap-12 py-14 sm:py-16 md:grid-cols-[1.3fr_0.7fr_1fr_1.1fr] md:gap-10 lg:gap-16">
        <div>
          <Image
            src="/techmind-logo.png"
            alt={company.name}
            width={180}
            height={52}
            className="h-9 w-auto brightness-0 invert md:h-10"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-on-ink">
            Complete digital marketing solutions that help businesses
            strengthen visibility, generate enquiries, build customer relationships, and grow online.
          </p>
          <div className="mt-7 flex gap-3">
            {[
              { icon: IconLinkedIn, label: "LinkedIn" },
              { icon: IconTwitter, label: "Twitter / X" },
              { icon: IconInstagram, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-slate-on-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-teal hover:text-teal"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-display text-lg">{col.heading}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-on-ink transition-colors hover:text-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-lg">Get in touch</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-slate-on-ink">
            <li className="flex items-start gap-2.5">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              {company.address}
            </li>
            <li className="flex items-center gap-2.5">
              <IconPhone className="h-4 w-4 shrink-0 text-teal" />
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-teal">
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <IconMail className="h-4 w-4 shrink-0 text-teal" />
              <a href={`mailto:${company.email}`} className="hover:text-teal">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap relative pb-14">
        <div className="grid gap-10 border-t border-line-dark pt-12 md:grid-cols-[1fr_1fr] md:items-end">
          <FooterNewsletter />
          <p
            aria-hidden
            className="select-none text-right font-display text-[22vw] leading-[0.8] tracking-tight md:text-[11rem]"
            style={{ backgroundImage: "var(--grad-accent-light)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: 0.9 }}
          >
            Tech.Mind
          </p>
        </div>
      </div>

      <div className="rule-dark">
        <div className="wrap flex flex-col gap-3 py-6 text-xs leading-relaxed text-slate-on-ink sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p>Strategy | Creativity | Performance</p>
        </div>
      </div>
    </footer>
  );
}
