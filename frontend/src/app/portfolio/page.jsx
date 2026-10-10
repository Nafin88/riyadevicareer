import ProjectCard from "@/components/ProjectCard";
import { CTABand, PageHero, Reveal } from "@/components/ui";
import { getProjects } from "@/lib/content";

export const metadata = { title: "Portfolio", description: "Selected web, app and digital projects delivered by Riyadvi." };

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero eyebrow="Portfolio" title={<>Projects that <span className="gold-text">deliver results</span></>}>
        A selection of work across healthcare, retail, real estate, biotech and more. Open any project for the full case study.
      </PageHero>
      <section className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 0.06}><ProjectCard project={p} /></Reveal>)}
      </section>
      <CTABand />
    </>
  );
}
