import JobBrowser from "@/components/JobBrowser";
import { PageHero } from "@/components/ui";
import { getJobs } from "@/lib/content";

export const metadata = { title: "Careers", description: "Join Riyadvi and help businesses grow with technology, design and innovation." };

export default async function CareersPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHero eyebrow="Careers" title={<>Build the future of digital with <span className="gold-text">Riyadvi</span></>}>Join a team that mixes engineering, design and business thinking. Find a role that fits you.</PageHero>
      <section className="container-x"><JobBrowser jobs={jobs} /></section>
    </>
  );
}
