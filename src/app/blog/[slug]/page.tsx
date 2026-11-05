import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

const intro = [
  "Every business owner who wants more customers online hits the same question sooner or later: should I spend on SEO or on Google Ads? Both put your business in front of people searching on Google. But they work very differently, cost differently and deliver results on different timelines.",
  "In this guide, the Tech.Mind team breaks down how each one works, when each makes sense, and why the smartest growth plans usually use both.",
];

const comparison = [
  ["Speed of results", "3–6 months", "Same day"],
  ["Cost model", "Ongoing effort, no cost per click", "Pay for every click"],
  ["When you stop investing", "Rankings fade slowly", "Traffic stops immediately"],
  ["Trust with searchers", "High, organic results feel earned", "Lower, marked as “Sponsored”"],
  ["Targeting control", "Limited, Google decides rankings", "Precise: keywords, location, time, device"],
  ["Best for", "Long-term, steady growth", "Quick leads, launches and offers"],
];

const faqs = [
  { q: "How long does SEO take to work?", a: "Most businesses start seeing meaningful results in three to six months, depending on competition and the current state of the website." },
  { q: "Is Google Ads expensive?", a: "It depends on your industry and keywords. You control your daily budget, and a well-managed campaign focuses spend on the searches most likely to convert." },
  { q: "Can I do SEO and Google Ads together?", a: "Yes, and it’s often the most effective approach. Ads deliver quick results while SEO builds long-term visibility." },
  { q: "Which is better for a small business?", a: "If you need leads immediately, start with a small Google Ads budget. If you can wait, SEO offers better long-term value. Many small businesses combine both." },
];

const h2 = "mt-14 font-display text-2xl text-ink md:text-3xl";
const p = "mt-4 text-lg leading-relaxed text-slate";
const ul = "mt-4 list-disc space-y-3 pl-6 text-lg leading-relaxed text-slate marker:text-teal-deep";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return { title: "Blog article" };
  return {
    title: { absolute: "SEO vs Google Ads: Which Should Your Business Choose? | Tech.Mind" },
    description:
      "SEO or Google Ads? Learn how each works, the costs, timelines and when to use both to grow your business. Expert guide by Tech.Mind.",
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article className="wrap py-12 md:py-20">
      <Link href="/blog" className="text-sm font-semibold text-teal-deep hover:underline">
        ← Back to all articles
      </Link>

      <header className="mx-auto mt-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate">
          <span className="rounded-full bg-teal-tint px-3 py-1 font-semibold text-teal-deep">{post.category}</span>
          <span>{post.date}</span>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-6xl">{post.title}</h1>
      </header>

      <div className="relative mx-auto mt-12 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl bg-ink-soft shadow-[var(--shadow-lift)]">
        <Image
          src={post.image}
          alt="SEO vs Google Ads: long-term growth compared with instant visibility"
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        {intro.map((t) => (
          <p key={t} className="mt-4 text-lg leading-relaxed text-slate first:mt-0 md:text-xl">{t}</p>
        ))}

        <h2 className={h2}>What is SEO?</h2>
        <p className={p}>
          SEO (Search Engine Optimisation) is the work of making your website rank higher in Google’s free, organic
          results. When someone searches “digital marketing agency near me” or “best dentist in my city”, SEO decides
          whether your site shows up on page one or page five.
        </p>
        <p className={p}>Good SEO covers three areas:</p>
        <ul className={ul}>
          <li><strong className="text-ink">On-page SEO:</strong> clear page titles, meta descriptions, headings and content that match what people search for.</li>
          <li><strong className="text-ink">Technical SEO:</strong> a fast, mobile-friendly, secure website that Google can crawl and understand easily.</li>
          <li><strong className="text-ink">Off-page SEO:</strong> backlinks from trusted websites, Google Business Profile optimisation and online reviews.</li>
        </ul>
        <p className={p}>
          The big advantage of SEO is that you don’t pay for each click. Once your pages rank, they keep bringing
          visitors month after month. The trade-off is time: SEO usually takes three to six months to show meaningful results.
        </p>

        <h2 className={h2}>What is Google Ads?</h2>
        <p className={p}>
          Google Ads is Google’s paid advertising platform. You bid on keywords, and your ad appears at the top of
          search results, marked “Sponsored”. You pay only when someone clicks, which is why it’s often called
          pay-per-click (PPC) advertising.
        </p>
        <p className={p}>Google Ads gives you:</p>
        <ul className={ul}>
          <li><strong className="text-ink">Instant visibility:</strong> your ads can go live and start bringing traffic the same day.</li>
          <li><strong className="text-ink">Precise targeting:</strong> choose keywords, locations, devices, times of day and audiences.</li>
          <li><strong className="text-ink">Full control over budget:</strong> set a daily limit and pause or scale anytime.</li>
          <li><strong className="text-ink">Clear measurement:</strong> track every click, call and enquiry back to the keyword that drove it.</li>
        </ul>
        <p className={p}>
          The trade-off is that traffic stops the moment you stop paying. And in competitive industries, cost per click
          can climb quickly without careful management.
        </p>

        <h2 className={h2}>SEO vs Google Ads at a glance</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left text-base">
            <thead>
              <tr className="bg-ink text-paper">
                <th className="px-4 py-3 font-semibold">Factor</th>
                <th className="px-4 py-3 font-semibold">SEO</th>
                <th className="px-4 py-3 font-semibold">Google Ads</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([factor, seo, ads], i) => (
                <tr key={factor} className={i % 2 ? "bg-teal-tint/40" : "bg-paper-raised"}>
                  <th scope="row" className="px-4 py-3 font-semibold text-ink">{factor}</th>
                  <td className="px-4 py-3 text-slate">{seo}</td>
                  <td className="px-4 py-3 text-slate">{ads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={h2}>Which one should you choose first?</h2>
        <h3 className="mt-6 font-display text-xl text-ink">Start with Google Ads if:</h3>
        <ul className={ul}>
          <li>You need enquiries or sales right now.</li>
          <li>You’re launching a new business, product or seasonal offer.</li>
          <li>Your website is new and has little or no Google ranking yet.</li>
          <li>You want to test which keywords actually convert before investing in SEO.</li>
        </ul>
        <h3 className="mt-8 font-display text-xl text-ink">Start with SEO if:</h3>
        <ul className={ul}>
          <li>You’re building a business for the long term and can wait a few months for results.</li>
          <li>Your budget can’t sustain ongoing ad spend.</li>
          <li>Your customers research carefully before buying and trust organic results.</li>
          <li>You want to reduce your dependence on paid advertising over time.</li>
        </ul>

        <h2 className={h2}>Why the best answer is often both</h2>
        <p className={p}>SEO and Google Ads aren’t rivals. Used together, each makes the other stronger:</p>
        <ul className={ul}>
          <li><strong className="text-ink">Ads bring leads while SEO builds.</strong> Paid campaigns keep enquiries coming in during the months SEO takes to gain traction.</li>
          <li><strong className="text-ink">Ad data sharpens your SEO.</strong> Google Ads shows exactly which keywords bring paying customers, so your SEO can target the terms that matter most.</li>
          <li><strong className="text-ink">More space on page one.</strong> When you appear in both the ads and the organic results, searchers see you twice, which builds trust and increases clicks.</li>
          <li><strong className="text-ink">Lower costs over time.</strong> As your organic rankings grow, you can gradually reduce ad spend on keywords you already rank for.</li>
        </ul>
        <p className={p}>
          A common approach is to start with a focused Google Ads campaign for immediate results, while building SEO in
          the background for long-term, lower-cost growth.
        </p>

        <h2 className={h2}>How Tech.Mind can help</h2>
        <p className={p}>
          At Tech.Mind, we don’t push one channel over another. We start by understanding your business, your customers
          and your goals, then build the right mix of{" "}
          <Link href="/services/seo" className="font-semibold text-teal-deep hover:underline">SEO</Link>,{" "}
          <Link href="/services/google-ads" className="font-semibold text-teal-deep hover:underline">Google Ads</Link>,{" "}
          <Link href="/services/meta-ads" className="font-semibold text-teal-deep hover:underline">Meta Ads</Link> and
          social media marketing to bring you quality enquiries.
        </p>
        <p className={p}>
          Whether you need leads this month or steady growth over the next year, we’ll create a plan that fits your
          budget and track every result clearly.
        </p>

        <div className="mt-8 rounded-3xl bg-ink p-8 text-paper">
          <p className="font-display text-2xl">Not sure where to start?</p>
          <p className="mt-2 text-paper/80">Discuss your project with our team and we’ll recommend the right strategy for your business.</p>
          <Link href="/contact" className="mt-5 inline-flex rounded-full bg-paper px-6 py-3 font-semibold text-ink transition-colors hover:bg-amber">
            Discuss your project
          </Link>
        </div>

        <h2 className={h2}>Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
          {faqs.map((f) => (
            <div key={f.q} className="p-5">
              <h3 className="font-display text-lg text-ink">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-slate">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}