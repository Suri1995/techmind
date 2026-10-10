import Link from "next/link";

type Crumb = { href: string; label: string };

/** Breadcrumb pill that works on both light and dark heroes. */
export default function HeroCrumbs({ crumbs, tone = "light" }: { crumbs: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-6 inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-1.5 text-xs ${
        dark ? "glass-dark text-slate-on-ink" : "border border-line bg-paper-raised/80 text-slate backdrop-blur"
      }`}
    >
      <Link href="/" className={`transition-colors ${dark ? "hover:text-aqua" : "hover:text-teal-deep"}`}>
        Home
      </Link>
      {crumbs.map((c) => (
        <span key={c.href} className="flex items-center gap-2">
          <span aria-hidden className={dark ? "text-line-dark" : "text-line"}>/</span>
          <Link
            href={c.href}
            aria-current="page"
            className={`transition-colors ${dark ? "text-paper hover:text-aqua" : "text-ink hover:text-teal-deep"}`}
          >
            {c.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
