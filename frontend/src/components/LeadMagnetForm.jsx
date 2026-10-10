"use client";
import { useState } from "react";
import { emailRe, useSubmit, API_URL } from "@/lib/api";
import { Field, FormStatus } from "./ui";

export default function LeadMagnetForm() {
  const [v, setV] = useState({ name: "", company: "", email: "", phone: "" });
  const { run, status, errors, message, data } = useSubmit("/lead-magnet", {
    validate: (x) => {
      const e = {};
      if (x.name.trim().length < 2) e.name = "Please enter your name";
      if (!emailRe.test(x.email)) e.email = "Enter a valid email address";
      if (x.phone.trim().length < 7) e.phone = "Enter a valid phone number";
      return e;
    },
  });
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  if (status === "success") {
    const url = data?.downloadUrl?.startsWith("http") ? data.downloadUrl : data?.downloadUrl;
    return (
      <div className="glass glass-gold rounded-3xl p-8 text-center" role="status">
        <h2 className="text-2xl font-semibold">Your guide is ready</h2>
        <p className="mt-2 text-muted">{message}</p>
        <a href={url} download className="btn btn-gold mt-6">Download the guide</a>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); run(v); }} noValidate className="glass space-y-4 rounded-3xl p-6 md:p-8">
      <Field label="Name" name="name" required value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
      <Field label="Company" name="company" value={v.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
      <Field label="Email" name="email" type="email" required value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
      <Field label="Phone" name="phone" type="tel" required value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
      <FormStatus status={status} message={message} />
      <button className="btn btn-gold w-full" disabled={status === "loading"}>{status === "loading" ? "Preparing…" : "Download the guide"}</button>
      <p className="text-center text-xs text-zinc-500">We'll only use your details to share the guide and follow up about your project.</p>
    </form>
  );
}
