import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyForm from "@/components/ApplyForm";
import { getJob, getJobs } from "@/lib/content";

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}
export async function generateMetadata({ params }) {
  const j = await getJob((await params).slug);
  return j ? { title: `${j.title} | Careers`, description: j.summary } : {};
}

// One reusable job template rendered from job data.
export default async function JobPage({ params }) {
  const job = await getJob((await params).slug);
  if (!job) notFound();
  const List = ({ title, items }) => (
    <div><h2 className="text-xl font-semibold">{title}</h2><ul className="mt-4 space-y-2">{items.map((i) => <li key={i} className="flex gap-3 text-zinc-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{i}</li>)}</ul></div>
  );
  return (
    <section className="container-x pt-32 md:pt-40">
      <Link href="/careers" className="text-sm text-muted hover:text-gold">← All openings</Link>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{job.title}</h1>
      <p className="mt-3 flex flex-wrap gap-2 text-xs">{[job.department, job.designation, job.experience, job.location, job.type].map((t) => <span key={t} className="rounded-full border border-gold/30 px-3 py-1 text-gold-light">{t}</span>)}</p>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <p className="text-lg leading-relaxed text-zinc-300">{job.summary}</p>
          <List title="Responsibilities" items={job.responsibilities} />
          <List title="Requirements" items={job.requirements} />
          <a href="#apply" className="btn btn-gold lg:hidden">Apply now</a>
        </div>
        <ApplyForm job={{ title: job.title, slug: job.slug }} />
      </div>
    </section>
  );
}
