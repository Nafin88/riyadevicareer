import Link from "next/link";
import ServiceShowcase from "@/components/ServiceShowcase";
import { CTABand, PageHero } from "@/components/ui";
import { getServices } from "@/lib/content";

export const metadata = { title: "Services", description: "Web development, app development, digital marketing, AR/VR, 3D modeling and UI/UX design." };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="Services" title={<>Everything you need to <span className="gold-text">build and grow</span></>}>
        Six connected capabilities delivered by one team, so strategy, design, technology and marketing work as a single system.
      </PageHero>
      <section className="container-x">
        <ServiceShowcase services={services} />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="glass group rounded-2xl p-6 transition-colors hover:border-gold/50">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.tagline}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
