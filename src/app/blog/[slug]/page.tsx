import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

const article = {
  title: "SEO vs Google Ads: Which Should Your Business Invest in First?",
  intro: "Both SEO and Google Ads can put your business in front of the right people. The better first investment depends on how quickly you need results, how customers search for you, and what you can consistently support.",
  sections: [
    { heading: "The difference between SEO and Google Ads", paragraphs: ["SEO improves your website and online presence so it can earn unpaid visibility in search results. It is an investment in pages, content, technical health and authority that can continue producing value over time.", "Google Ads is paid search advertising. You choose the searches you want to appear for, set a budget and pay when someone clicks. It can create visibility almost immediately, but the traffic stops when the budget stops."] },
    { heading: "When SEO is the better first investment", paragraphs: ["Choose SEO first when your business is building a long-term acquisition channel. It is especially useful when people research before they buy, your market has repeat search demand, and you can commit to improving the site month after month.", "SEO also makes sense when you want to reduce dependence on paid traffic. Strong service pages, useful answers and a healthy technical foundation can bring qualified visitors without paying for every visit."] },
    { heading: "When Google Ads should come first", paragraphs: ["Google Ads is often the better starting point when you need enquiries quickly, have a clear offer or serve a location where customers already search with intent. A well-built campaign can test demand and messaging before you invest heavily in content.", "It is also useful for launches, seasonal offers and competitive searches where organic rankings will take time. The important part is to send clicks to a focused landing page and measure calls, forms or purchases—not just traffic."] },
    { heading: "A practical way to decide", paragraphs: ["Start with the customer journey. If people already search for your service and you need results now, begin with Google Ads while building your SEO foundation in parallel. If your sales cycle is longer and you can wait for compounding returns, prioritise SEO.", "For many businesses, the strongest approach is not SEO versus Ads. Ads provide fast feedback and immediate visibility; SEO builds an owned channel that becomes more valuable over time. Use the data from paid search to discover the language customers use, then turn those insights into better pages and content."] },
    { heading: "What to measure", paragraphs: ["For SEO, track qualified organic traffic, impressions, rankings for important topics, enquiries and revenue assisted by organic search. For Google Ads, track cost per qualified enquiry, conversion rate, impression share and return on ad spend where purchases are measurable.", "Whichever channel you choose, connect it to business outcomes. A cheaper click is not automatically better, and a higher ranking is not useful if it brings the wrong audience."] },
  ],
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = blogPosts.find((item) => item.slug === slug);
    return { title: post?.title ?? "Blog article", description: article.intro };
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article className="wrap py-12 md:py-20">
      <Link href="/blog" className="text-sm font-semibold text-teal-deep hover:underline">← Back to all articles</Link>
      <header className="mx-auto mt-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate"><span className="rounded-full bg-teal-tint px-3 py-1 font-semibold text-teal-deep">{post.category}</span><span>{post.date}</span><span aria-hidden>·</span><span>{post.readTime}</span></div>
        <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-ink md:text-6xl">{article.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate md:text-xl">{article.intro}</p>
      </header>
      <div className="relative mx-auto mt-12 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl bg-ink-soft shadow-[var(--shadow-lift)]"><Image src={post.image} alt="SEO compared with Google Ads for business growth" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" /></div>
      <div className="prose prose-lg mx-auto mt-14 max-w-3xl text-slate">
        {article.sections.map((section) => <section key={section.heading} className="mb-10"><h2 className="font-display text-2xl text-ink md:text-3xl">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed">{paragraph}</p>)}</section>)}
      </div>
    </article>
  );
}
