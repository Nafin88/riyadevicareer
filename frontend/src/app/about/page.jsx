import Timeline from "@/components/Timeline";
import { CTABand, PageHero, Reveal, SectionHeading } from "@/components/ui";

export const metadata = { title: "About", description: "Riyadvi Software Technologies: our story, vision, mission and values since 2021." };

const VALUES = [
  ["Partnership", "We succeed when our clients grow, so we think long-term."],
  ["Craft", "Clean engineering and thoughtful design in every detail."],
  ["Innovation", "We explore new technology, then apply only what helps."],
  ["Integrity", "Honest estimates, clear communication, no surprises."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Riyadvi" title={<>Technology, design and business thinking, <span className="gold-text">together</span></>}>
        Founded in 2021, Riyadvi Software Technologies helps businesses plan, build and grow with digital solutions.
      </PageHero>

      <section className="container-x grid gap-6 md:grid-cols-2">
        <Reveal className="glass glass-gold rounded-3xl p-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Vision</p><p className="mt-3 text-xl leading-relaxed">To be the technology and digital solutions partner businesses trust to turn ideas into lasting growth.</p></Reveal>
        <Reveal delay={0.1} className="glass rounded-3xl p-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Mission</p><p className="mt-3 text-xl leading-relaxed">To deliver custom software and digital experiences that are beautiful, reliable and built around measurable business outcomes.</p></Reveal>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Our story" title="From a small team with a big idea" />
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-zinc-300">
          <p>Riyadvi began in 2021 with a belief that businesses grow faster when strategy, design and engineering are not separate silos. We started with websites and apps, and kept adding the capabilities our clients needed next.</p>
          <p>Today we combine web and app development, UI/UX, digital marketing, 3D, AR and VR, with a Business Health Checkup approach that finds the highest-impact improvements first.</p>
        </div>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Values" title="How we work" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([t, d], i) => <Reveal key={t} delay={i * 0.06} className="glass rounded-2xl p-6"><h3 className="text-lg font-semibold text-gold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></Reveal>)}
        </div>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Our approach" title="Strategy first, then build, then grow" />
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {["Understand your business", "Design the right solution", "Build with quality", "Measure and grow"].map((s, i) => <Reveal as="li" key={s} delay={i * 0.06} className="glass rounded-2xl p-5"><span className="font-display text-3xl text-gold/80">0{i + 1}</span><p className="mt-2 font-medium">{s}</p></Reveal>)}
        </ol>
      </section>

      <section className="container-x pt-24">
        <SectionHeading eyebrow="Milestones" title="Our journey" center />
        <div className="mt-14"><Timeline /></div>
      </section>

      <CTABand title="Let's talk about your next step" />
    </>
  );
}
