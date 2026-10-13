"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { emailRe, useSubmit } from "@/lib/api";
import { Field, FormStatus } from "./ui";

const STEPS = ["Business", "Digital presence", "Marketing", "Technology", "Challenges", "Review"];
const CHANNELS = ["SEO", "Google Ads", "Social media", "Email", "Content / blog", "Offline / referrals"];
const CHALLENGES = ["Not enough leads", "Outdated website", "Low conversions", "Manual processes", "Scaling technology", "Weak brand presence", "Need a mobile app"];

const init = {
  business: { name: "", industry: "", size: "", contactName: "", email: "", phone: "" },
  digital: { hasWebsite: "", websiteUrl: "", websiteAge: "", mobileFriendly: "" },
  marketing: { channels: [], monthlyBudget: "", trackingLeads: "" },
  technology: { currentStack: "", internalTeam: "", automationLevel: "" },
  challenges: { topChallenges: [], goals: "", timeline: "" },
};

function Chips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return <button type="button" key={o} aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-gold bg-gold/15 text-gold-light" : "border-white/15 text-zinc-300 hover:border-white/40"}`}>{o}</button>;
      })}
    </div>
  );
}

export default function HealthCheckupForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(init);
  const [stepErr, setStepErr] = useState({});
  const { run, status, errors, message, data } = useSubmit("/health-checkup");
  const upd = (sec, k) => (e) => setD((p) => ({ ...p, [sec]: { ...p[sec], [k]: e.target ? e.target.value : e } }));

  function validateStep() {
    const e = {};
    if (step === 0) {
      const b = d.business;
      if (b.name.trim().length < 2) e["business.name"] = "Enter your business name";
      if (b.contactName.trim().length < 2) e["business.contactName"] = "Enter your name";
      if (!emailRe.test(b.email)) e["business.email"] = "Enter a valid email";
    }
    setStepErr(e);
    return !Object.keys(e).length;
  }
  const next = () => validateStep() && setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const err = (k) => stepErr[k] || errors[k];

  if (status === "success") {
    return (
      <div className="glass glass-gold rounded-3xl p-8 text-center md:p-12" role="status">
        <p className="font-display text-6xl font-semibold gold-text">{data?.score ?? "–"}<span className="text-2xl text-zinc-500">/100</span></p>
        <h2 className="mt-4 text-2xl font-semibold">Thanks! Your checkup is in.</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">Your indicative digital-readiness score is above. Our team will review your answers and contact you with tailored recommendations.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (step === STEPS.length - 1) run(d); else next(); }} noValidate className="glass rounded-3xl p-6 md:p-10">
      <ol className="mb-8 flex gap-1.5" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-white/10"}`} />
            <span className={`mt-2 hidden text-[11px] sm:block ${i === step ? "text-gold-light" : "text-zinc-600"}`}>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mb-4 text-sm text-muted sm:hidden">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="min-h-72 space-y-4">
          {step === 0 && (<>
            <Field label="Business name" name="bn" required value={d.business.name} onChange={upd("business", "name")} error={err("business.name")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry" name="ind" value={d.business.industry} onChange={upd("business", "industry")} />
              <Field label="Company size" name="size" as="select" value={d.business.size} onChange={upd("business", "size")}><option value="">Select</option>{["1-10", "11-50", "51-200", "200+"].map((o) => <option key={o}>{o}</option>)}</Field>
              <Field label="Your name" name="cn" required value={d.business.contactName} onChange={upd("business", "contactName")} error={err("business.contactName")} />
              <Field label="Email" name="em" type="email" required value={d.business.email} onChange={upd("business", "email")} error={err("business.email")} />
              <Field label="Phone" name="ph" type="tel" value={d.business.phone} onChange={upd("business", "phone")} error={err("business.phone")} />
            </div>
          </>)}
          {step === 1 && (<>
            <Field label="Do you have a website?" name="hw" as="select" value={d.digital.hasWebsite} onChange={upd("digital", "hasWebsite")}><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></Field>
            <Field label="Website URL" name="wu" placeholder="https://" value={d.digital.websiteUrl} onChange={upd("digital", "websiteUrl")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Website age" name="wa" as="select" value={d.digital.websiteAge} onChange={upd("digital", "websiteAge")}><option value="">Select</option>{["Under 1 year", "1-3 years", "3-5 years", "5+ years"].map((o) => <option key={o}>{o}</option>)}</Field>
              <Field label="Works well on mobile?" name="mf" as="select" value={d.digital.mobileFriendly} onChange={upd("digital", "mobileFriendly")}><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Not sure</option></Field>
            </div>
          </>)}
          {step === 2 && (<>
            <div><p className="mb-2 text-sm font-medium text-zinc-300">Which channels do you use today?</p><Chips options={CHANNELS} value={d.marketing.channels} onChange={upd("marketing", "channels")} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Monthly marketing budget" name="mb" as="select" value={d.marketing.monthlyBudget} onChange={upd("marketing", "monthlyBudget")}><option value="">Select</option>{["None yet", "Under ₹25k", "₹25k–₹1L", "₹1L+"].map((o) => <option key={o}>{o}</option>)}</Field>
              <Field label="Do you track leads?" name="tl" as="select" value={d.marketing.trackingLeads} onChange={upd("marketing", "trackingLeads")}><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></Field>
            </div>
          </>)}
          {step === 3 && (<>
            <Field label="Current technology / platforms" name="cs" placeholder="e.g. WordPress, custom PHP, spreadsheets" value={d.technology.currentStack} onChange={upd("technology", "currentStack")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="In-house tech team?" name="it" as="select" value={d.technology.internalTeam} onChange={upd("technology", "internalTeam")}><option value="">Select</option>{["None", "1-3 people", "4+ people"].map((o) => <option key={o}>{o}</option>)}</Field>
              <Field label="Process automation" name="al" as="select" value={d.technology.automationLevel} onChange={upd("technology", "automationLevel")}><option value="">Select</option><option value="low">Mostly manual</option><option value="medium">Some automation</option><option value="high">Highly automated</option></Field>
            </div>
          </>)}
          {step === 4 && (<>
            <div><p className="mb-2 text-sm font-medium text-zinc-300">Biggest challenges right now</p><Chips options={CHALLENGES} value={d.challenges.topChallenges} onChange={upd("challenges", "topChallenges")} /></div>
            <Field label="Goals for the next 12 months" name="gl" as="textarea" rows={3} value={d.challenges.goals} onChange={upd("challenges", "goals")} />
            <Field label="Timeline" name="tm" as="select" value={d.challenges.timeline} onChange={upd("challenges", "timeline")}><option value="">Select</option>{["Immediately", "1-3 months", "3-6 months", "Exploring"].map((o) => <option key={o}>{o}</option>)}</Field>
          </>)}
          {step === 5 && (
            <div className="space-y-3 text-sm">
              <h2 className="text-xl font-semibold">Review &amp; submit</h2>
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {[["Business", d.business.name], ["Contact", `${d.business.contactName} · ${d.business.email}`], ["Website", d.digital.websiteUrl || d.digital.hasWebsite || "—"], ["Channels", d.marketing.channels.join(", ") || "—"], ["Challenges", d.challenges.topChallenges.join(", ") || "—"], ["Timeline", d.challenges.timeline || "—"]].map(([k, val]) => (
                  <div key={k} className="rounded-xl border border-white/10 p-3"><dt className="text-xs uppercase tracking-widest text-gold">{k}</dt><dd className="mt-1 text-zinc-200">{val}</dd></div>
                ))}
              </dl>
              <FormStatus status={status} message={message} />
              {Object.entries(errors).length > 0 && <ul className="text-xs text-red-300">{Object.entries(errors).map(([k, m]) => <li key={k}>{k}: {m}</li>)}</ul>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>Back</button>
        <button type="submit" className="btn btn-gold" disabled={status === "loading"}>{step === STEPS.length - 1 ? (status === "loading" ? "Submitting…" : "Submit checkup") : "Continue"}</button>
      </div>
    </form>
  );
}
