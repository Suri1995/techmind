import type { Metadata } from "next";
import ServiceNav from "@/components/ServiceNav";
import { services } from "@/lib/data";
import ServiceOverviewList from "@/components/Serviceoverviewlist";
import ServicesCta from "@/components/Servicecta";
import ServicesHero from "@/components/heroes/ServicesHero";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Meta Ads, Google Ads, SEO, influencer marketing, video and graphics, websites and apps, web applications and complete performance marketing, under one roof.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceNav services={services} />
      <ServiceOverviewList services={services} />
      <ServicesCta />
    </>
  );
}