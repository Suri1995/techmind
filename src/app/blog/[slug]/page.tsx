import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroCrumbs from "@/components/heroes/HeroCrumbs";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <header className="bg-[linear-gradient(160deg,#fbf6ec_0%,var(--paper)_65%)] pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="wrap">
          <HeroCrumbs crumbs={[{ href: "/blog", label: "Blog" }, { href: `/blog/${post.slug}`, label: post.title }]} />
          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate">
              <span className="rounded-full bg-teal-tint px-3 py-1 font-medium text-teal-deep">{post.category}</span>
              <span>{post.date}</span>
              <span aria-hidden>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl leading-[1.08] text-ink sm:text-6xl">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">{post.excerpt}</p>
          </div>
        </div>
      </header>

      <div className="wrap pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-ink shadow-[var(--shadow-lift)]">
          <Image src={post.image} alt="SEO versus Google Ads comparison graphic" fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          {post.sections.map((section) => (
            <section key={section.heading} className="mb-12 last:mb-0">
              <h2 className="font-display text-3xl leading-tight text-ink">{section.heading}</h2>
              <div className="mt-5 space-y-5 text-[1.05rem] leading-8 text-slate">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets && (
                <ul className="mt-6 space-y-3 border-l-2 border-teal-deep pl-6 text-[1.05rem] leading-7 text-ink-soft">
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
            </section>
          ))}
          <div className="mt-14 border-t border-line pt-8">
            <Link href="/blog" className="text-sm font-semibold text-teal-deep transition-colors hover:text-ink">← Back to all articles</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
