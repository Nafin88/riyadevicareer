"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { emailRe, useSubmit } from "@/lib/api";
import { Field, FormStatus } from "./ui";
import services from "@/data/services.json";

const REQUIREMENTS = [...services.map((s) => s.title), "Business Health Checkup", "Something else"];

export default function ContactForm() {
  const sp = useSearchParams();
  const intent = sp.get("intent") === "consultation" ? "consultation" : "contact";
  const svc = services.find((s) => s.slug === sp.get("service"))?.title;
  const [v, setV] = useState({ name: "", email: "", phone: "", company: "", requirement: svc || "", message: "", preferredTime: "" });
  const { run, status, errors, message } = useSubmit(intent === "consultation" ? "/consultation" : "/contact", {
    validate: (x) => {
      const e = {};
      if (x.name.trim().length < 2) e.name = "Please enter your name";
      if (!emailRe.test(x.email)) e.email = "Enter a valid email address";
      if (intent === "consultation" && x.phone.trim().length < 7) e.phone = "Phone is required for consultations";
      if (intent === "contact" && x.message.trim().length < 5) e.message = "Please tell us a little more";
      return e;
    },
  });
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await run(v);
    if (ok) setV({ name: "", email: "", phone: "", company: "", requirement: "", message: "", preferredTime: "" });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass space-y-4 rounded-3xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold">{intent === "consultation" ? "Book a free consultation" : "Send us a message"}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" required value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required={intent === "consultation"} value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
        <Field label="Company" name="company" value={v.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
      </div>
      <Field label="Requirement" name="requirement" as="select" value={v.requirement} onChange={set("requirement")} error={errors.requirement}>
        <option value="">Select a service</option>
        {REQUIREMENTS.map((r) => <option key={r}>{r}</option>)}
      </Field>
      {intent === "consultation" && <Field label="Preferred time" name="preferredTime" placeholder="e.g. Weekdays after 3 PM IST" value={v.preferredTime} onChange={set("preferredTime")} error={errors.preferredTime} />}
      <Field label="Message" name="message" as="textarea" rows={5} required={intent === "contact"} value={v.message} onChange={set("message")} error={errors.message} placeholder="Tell us about your project or goals" />
      <FormStatus status={status} message={message} />
      <button className="btn btn-gold w-full" disabled={status === "loading"}>{status === "loading" ? "Sending…" : intent === "consultation" ? "Request consultation" : "Send message"}</button>
    </form>
  );
}
