import ClientsSection from "@/components/home-components/clientsSection";
import CTA from "@/components/home-components/cta";
import FAQ from "@/components/home-components/faq";
import Hero from "@/components/home-components/hero";
import IndustryMarquee from "@/components/home-components/industryMarquee";
import Planner from "@/components/home-components/planner";
import Process from "@/components/home-components/process";
import Services from "@/components/home-components/services";
import Stats from "@/components/home-components/stats";
import WhyTechMind from "@/components/home-components/whyTechMind";

export default function Home() {
  return (
    <>
      <Hero />
      <IndustryMarquee />
      <Stats />
      <Services />
      <Process />
      <ClientsSection />
      <WhyTechMind />
      <Planner />
      <FAQ />
      <CTA />
    </>
  );
}
