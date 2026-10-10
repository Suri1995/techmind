import type { Metadata } from "next";
import ClientsHero from "@/components/heroes/ClientsHero";
import ClientsExplorer from "@/components/ClientsExplorer";
import CTA from "@/components/home-components/cta";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Ongoing digital marketing partnerships across real estate, healthcare, jewellery, hospitality, wellness, farming and pet training.",
};

export default function ClientsPage() {
  return (
    <>
      <ClientsHero />
      <section className="wrap py-16 md:py-24">
        <ClientsExplorer />
        <p className="mt-12 text-sm leading-relaxed text-slate">
          Want to know more about the work behind any of these partnerships? Ask us and we will walk you through relevant examples.
        </p>
      </section>
      <CTA />
    </>
  );
}
