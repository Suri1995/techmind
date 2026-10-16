import type { Service } from "@/lib/data";
import ServiceOverview from "@/components/ServiceOverview";

/** The full list of service overview blocks shown below the jump nav on /services. */
export default function ServiceOverviewList({ services }: { services: Service[] }) {
  return (
    <section className="wrap py-16 md:py-24">
      {services.map((service, i) => (
        <ServiceOverview key={service.slug} service={service} index={i} />
      ))}
    </section>
  );
}