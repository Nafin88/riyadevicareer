import Link from "next/link";
import Hero from "@/components/Hero";
import ServiceShowcase from "@/components/ServiceShowcase";
import Transformation from "@/components/Transformation";
import TechSection from "@/components/TechSection";
import Timeline from "@/components/Timeline";
import ProjectCard from "@/components/ProjectCard";
import { CTABand, Reveal, SectionHeading } from "@/components/ui";
import { JOURNEY } from "@/data/tech";
import { getProjects, getServices } from "@/lib/content";

export default async function Home() {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  return (
    <>
      <Hero />

      <section className="mt-10 md:mt-0">
        <div className="container-x pb-10 pt-20 md:pt-32">
          <SectionHeading eyebrow="Our approach" title={<>From business challenge to <span className="gold-text">measurable growth</span></>}>
            Scroll through how we turn goals into launched, growing digital products.
          </SectionHeading>
        </div>
        <Transformation />
      </section>

      <section id="solutions" className="container-x scroll-mt-24 pt-24 md:pt-32">
        <SectionHeading eyebrow="Solutions" title="Six services, one connected partner" className="mb-12">
          Hover or tap a service to see it come to life, then dive into the details.
        </SectionHeading>
        <ServiceShowcase services={services} />
      </section>

      <section className="container-x pt-24 md:pt-40">
        <SectionHeading eyebrow="Technology" title="A modern stack, chosen for your goals" center>
          The tools we use to build fast, scalable and beautiful digital products.
        </SectionHeading>
        <Reveal className="mt-12"><TechSection /></Reveal>
      </section>

      <section className="container-x pt-24 md:pt-40">
        <SectionHeading eyebrow="Why Riyadvi" title="Building trust since 2021" center>A journey of steady growth, from one idea to a full digital partner.</SectionHeading>
        <div className="mt-14"><Timeline /></div>
      </section>

      <section className="container-x grid gap-6 pt-24 md:grid-cols-2 md:pt-32">
        <Reveal className="glass glass-gold relative overflow-hidden rounded-3xl p-8 md:p-10">
          <div className="glow-orb -right-10 -top-10 h-48 w-48 bg-gold/25" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Business Health Checkup</p>
          <h3 className="mt-3 text-2xl font-semibold md:text-3xl">Where are your biggest digital growth opportunities?</h3>
          <p className="mt-3 text-muted">Answer a few guided questions about your website, marketing and technology and we'll identify the improvements worth making first.</p>
          <Link href="/business-health-checkup" className="btn btn-gold mt-6">Start the free checkup</Link>
        </Reveal>
        <Reveal delay={0.1} className="glass rounded-3xl p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">End-to-end solutions</p>
          <h3 className="mt-3 text-2xl font-semibold md:text-3xl">One partner for the full journey</h3>
          <ol className="mt-6 space-y-2">
            {JOURNEY.map((j, i) => (
              <li key={j} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold">{i + 1}</span>
                <span className="font-medium">{j}</span>
                {i < JOURNEY.length - 1 && <span className="ml-auto text-zinc-600" aria-hidden>↓</span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="container-x pt-24 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Portfolio" title="Work that moves businesses forward" />
          <Link href="/portfolio" className="btn btn-ghost">View all projects</Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.slice(0, 4).map((p, i) => <Reveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></Reveal>)}
        </div>
      </section>

      <CTABand />
    </>
  );
}
