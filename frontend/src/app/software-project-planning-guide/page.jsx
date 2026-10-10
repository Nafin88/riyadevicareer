import LeadMagnetForm from "@/components/LeadMagnetForm";
import { PageHero } from "@/components/ui";

export const metadata = { title: "Software Project Planning Guide", description: "Download the free Software Project Planning Guide from Riyadvi." };

const POINTS = ["Define scope and success metrics before you build", "Choose the right team, stack and budget approach", "Plan milestones, risks and approvals", "Checklist for launch readiness and post-launch growth"];

export default function GuidePage() {
  return (
    <>
      <PageHero eyebrow="Free resource" title={<>Download <span className="gold-text">Software Project Planning Guide</span></>}>
        A practical guide to planning software projects that finish on time and on budget.
      </PageHero>
      <section className="container-x grid items-start gap-10 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-semibold">Inside the guide</h2>
          <ul className="mt-5 space-y-3">{POINTS.map((p) => <li key={p} className="flex gap-3"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs text-gold" aria-hidden>✓</span>{p}</li>)}</ul>
        </div>
        <LeadMagnetForm />
      </section>
    </>
  );
}
