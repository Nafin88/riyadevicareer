import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceHeroVisual from "@/components/ServiceHeroVisual";
import ProjectCard from "@/components/ProjectCard";
import { CTABand, Reveal, SectionHeading } from "@/components/ui";
import { getProjects, getService, getServices } from "@/lib/content";

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = await getService((await params).slug);
  return s ? { title: s.title, description: s.tagline } : {};
}

// One reusable template renders all six services from data.
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [service, projects, all] = await Promise.all([getService(slug), getProjects(), getServices()]);
  if (!service) notFound();
  const related = projects.filter((p) => p.services.includes(service.slug)).slice(0, 3);
  const others = all.filter((s) => s.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="glow-orb right-0 top-10 h-80 w-80 bg-gold/15" aria-hidden />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Link href="/services" className="text-sm text-muted hover:text-gold">← All services</Link>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl"><span className="gold-text">{service.title}</span></h1>
            <p className="mt-5 max-w-lg text-lg text-zinc-300">{service.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/contact?intent=quote&service=${service.slug}`} className="btn btn-gold">Get a Quote</Link>
              <Link href="/contact?intent=consultation" className="btn btn-ghost">Book a Consultation</Link>
            </div>
          </div>
          <ServiceHeroVisual service={service} />
        </div>
      </section>

      <section className="container-x grid gap-6 pt-12 md:grid-cols-2">
        <Reveal className="glass rounded-3xl p-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">The problem</p><p className="mt-3 text-lg leading-relaxed">{service.problem}</p></Reveal>
        <Reveal delay={0.1} className="glass glass-gold rounded-3xl p-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our solution</p><p className="mt-3 text-lg leading-relaxed">{service.solution}</p></Reveal>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Key features" title="What you get" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <Reveal as="li" key={f} delay={i * 0.05} className="glass flex gap-3 rounded-2xl p-5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs text-gold" aria-hidden>✓</span><span>{f}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x grid gap-12 pt-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Industry use cases" title="Where it works best" />
          <ul className="mt-8 space-y-3">{service.useCases.map((u) => <li key={u} className="flex items-center gap-3 border-b border-white/10 pb-3"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{u}</li>)}</ul>
        </div>
        <div>
          <SectionHeading eyebrow="Technology stack" title="Tools we use" />
          <ul className="mt-8 flex flex-wrap gap-2">{service.stack.map((t) => <li key={t} className="rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold-light">{t}</li>)}</ul>
        </div>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Process" title="How we work" />
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {service.process.map((p, i) => (
            <Reveal as="li" key={p} delay={i * 0.06} className="glass relative rounded-2xl p-5">
              <span className="font-display text-3xl font-semibold text-gold/80">0{i + 1}</span>
              <p className="mt-2 font-medium">{p}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="container-x pt-24">
          <SectionHeading eyebrow="Related portfolio" title={`${service.title} in action`} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{related.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
        </section>
      )}

      <section className="container-x pt-20">
        <p className="mb-4 text-sm text-muted">Explore other services</p>
        <div className="flex flex-wrap gap-2">{others.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} className="btn btn-ghost !py-2 text-sm">{s.title}</Link>)}</div>
      </section>

      <CTABand title={`Ready to start with ${service.title}?`} primary={{ href: `/contact?intent=quote&service=${service.slug}`, label: "Get a Quote" }} />
    </>
  );
}
