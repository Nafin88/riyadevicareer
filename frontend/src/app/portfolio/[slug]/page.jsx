import Link from "next/link";
import { notFound } from "next/navigation";
import CaseVisual from "@/components/CaseVisual";
import ProjectCard from "@/components/ProjectCard";
import { CTABand, Reveal, SectionHeading } from "@/components/ui";
import { getProject, getProjects, getServices } from "@/lib/content";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = await getProject((await params).slug);
  return p ? { title: `${p.client} Case Study`, description: p.summary } : {};
}

// One reusable case-study template; projects flagged `interactive` get a 3D presentation.
export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const [project, projects, services] = await Promise.all([getProject(slug), getProjects(), getServices()]);
  if (!project) notFound();
  const related = services.filter((s) => project.services.includes(s.slug));
  const more = projects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="glow-orb left-1/2 top-0 h-72 w-136 -translate-x-1/2 opacity-40" style={{ background: project.accent }} aria-hidden />
        <div className="container-x relative">
          <Link href="/portfolio" className="text-sm text-muted hover:text-gold">← All projects</Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Case study · {project.industry}</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-300">{project.summary}</p>
        </div>
      </section>

      <section className="container-x">
        {project.interactive ? (
          <CaseVisual project={project} />
        ) : (
          <div className="relative aspect-16/8 overflow-hidden rounded-3xl border border-white/10" style={{ background: `linear-gradient(135deg, ${project.accent}66, #000 75%)` }}>
            <div className="grid-bg absolute inset-0 opacity-60" />
            <span className="absolute bottom-6 left-6 font-display text-4xl font-semibold md:text-6xl">{project.client}</span>
          </div>
        )}
      </section>

      <section className="container-x grid gap-4 pt-10 sm:grid-cols-3">
        {[["Client", project.client], ["Industry", project.industry], ["Technologies", project.technologies.join(" · ")]].map(([k, v]) => (
          <div key={k} className="glass rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-gold">{k}</p><p className="mt-1 font-medium">{v}</p></div>
        ))}
      </section>

      <section className="container-x grid gap-6 pt-12 md:grid-cols-2">
        <Reveal className="glass rounded-3xl p-8"><h2 className="text-xl font-semibold">The challenge</h2><p className="mt-3 leading-relaxed text-muted">{project.challenge}</p></Reveal>
        <Reveal delay={0.1} className="glass glass-gold rounded-3xl p-8"><h2 className="text-xl font-semibold">Our solution</h2><p className="mt-3 leading-relaxed text-muted">{project.solution}</p></Reveal>
      </section>

      <section className="container-x pt-16">
        <SectionHeading eyebrow="Results" title="What changed" />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {project.results.map((r, i) => <Reveal as="li" key={r} delay={i * 0.06} className="glass rounded-2xl p-6"><span className="font-display text-3xl text-gold">0{i + 1}</span><p className="mt-2 font-medium">{r}</p></Reveal>)}
        </ul>
      </section>

      <section className="container-x pt-16">
        <h2 className="text-xl font-semibold">Related services</h2>
        <div className="mt-4 flex flex-wrap gap-2">{related.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} className="btn btn-ghost py-2! text-sm">{s.title}</Link>)}</div>
      </section>

      <section className="container-x pt-20">
        <h2 className="mb-6 text-xl font-semibold">More projects</h2>
        <div className="grid gap-6 md:grid-cols-2">{more.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
      </section>

      <CTABand title="Want results like these?" />
    </>
  );
}
