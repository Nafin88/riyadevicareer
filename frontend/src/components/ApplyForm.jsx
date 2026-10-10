"use client";
import { useState } from "react";
import { emailRe, submit } from "@/lib/api";
import { Field, FormStatus } from "./ui";

export default function ApplyForm({ job }) {
  const [v, setV] = useState({ name: "", email: "", phone: "", message: "" });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: "idle", message: "" });
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const err = {};
    if (v.name.trim().length < 2) err.name = "Please enter your name";
    if (!emailRe.test(v.email)) err.email = "Enter a valid email address";
    if (!file) err.resume = "Please attach your resume (PDF or Word, max 5 MB)";
    else if (file.size > 5 * 1024 * 1024) err.resume = "File is larger than 5 MB";
    setErrors(err);
    if (Object.keys(err).length) return setState({ status: "error", message: "Please fix the highlighted fields." });

    setState({ status: "loading", message: "" });
    const fd = new FormData();
    Object.entries({ ...v, position: job.title, jobSlug: job.slug }).forEach(([k, val]) => fd.append(k, val));
    fd.append("resume", file);
    const res = await submit("/applications", fd);
    if (res.ok) { setState({ status: "success", message: res.message }); setV({ name: "", email: "", phone: "", message: "" }); setFile(null); }
    else { setErrors(res.errors || {}); setState({ status: "error", message: res.message }); }
  }

  return (
    <form id="apply" onSubmit={onSubmit} noValidate className="glass space-y-4 rounded-3xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold">Apply for this role</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" required value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
        <Field label="Position" name="position" value={job.title} readOnly />
      </div>
      <Field label="Resume (PDF / DOC / DOCX, max 5 MB)" name="resume" type="file" accept=".pdf,.doc,.docx" required onChange={(e) => setFile(e.target.files?.[0] || null)} error={errors.resume} />
      <Field label="Message" name="message" as="textarea" rows={4} value={v.message} onChange={set("message")} error={errors.message} placeholder="Tell us why you'd be a great fit" />
      <FormStatus status={state.status} message={state.message} />
      <button className="btn btn-gold w-full" disabled={state.status === "loading"}>{state.status === "loading" ? "Submitting…" : "Submit application"}</button>
    </form>
  );
}
