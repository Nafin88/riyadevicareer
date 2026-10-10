"use client";
import Link from "next/link";
import { useState } from "react";

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-xs text-zinc-400">{label}
      <select className="field mt-1 !py-2" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>{options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function JobBrowser({ jobs }) {
  const [dep, setDep] = useState("");
  const [des, setDes] = useState("");
  const [exp, setExp] = useState("");
  const uniq = (k) => [...new Set(jobs.map((j) => j[k]))];
  const list = jobs.filter((j) => (!dep || j.department === dep) && (!des || j.designation === des) && (!exp || j.experience === exp));
  return (
    <div>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Select label="Department" value={dep} onChange={setDep} options={uniq("department")} />
        <Select label="Designation" value={des} onChange={setDes} options={uniq("designation")} />
        <Select label="Experience" value={exp} onChange={setExp} options={uniq("experience")} />
      </div>
      <ul className="space-y-4">
        {list.map((j) => (
          <li key={j.slug}>
            <Link href={`/careers/${j.slug}`} className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-colors hover:border-gold/50 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold group-hover:text-gold-light">{j.title}</h3>
                <p className="mt-1 text-sm text-muted">{j.summary}</p>
                <p className="mt-3 flex flex-wrap gap-2 text-xs">{[j.department, j.experience, j.location, j.type].map((t) => <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-zinc-400">{t}</span>)}</p>
              </div>
              <span className="text-sm font-semibold text-gold">View role →</span>
            </Link>
          </li>
        ))}
      </ul>
      {!list.length && <p className="py-16 text-center text-muted">No openings match these filters.</p>}
    </div>
  );
}
