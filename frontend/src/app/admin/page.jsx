"use client";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { Logo } from "@/components/Navbar";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "enquiries", label: "Enquiries", path: "enquiries" },
  { id: "health", label: "Health Checkups", path: "health-checkups" },
  { id: "leads", label: "Lead Magnet", path: "lead-magnets" },
  { id: "applications", label: "Careers", path: "applications" },
];
const STATUSES = ["new", "contacted", "qualified", "closed"];
const APP_STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"];

async function api(token, path, opts = {}) {
  const res = await fetch(`${API_URL}/api/admin/${path}`, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.message || "Request failed"), { status: res.status });
  return json.data;
}

function Login({ onToken }) {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Login failed");
      sessionStorage.setItem("riyadvi_admin", json.data.token); onToken(json.data.token);
    } catch (x) { setErr(x.message === "Failed to fetch" ? "Cannot reach the API" : x.message); } finally { setBusy(false); }
  }
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={go} className="glass w-full max-w-sm space-y-4 rounded-3xl p-8">
        <Logo /><h1 className="text-2xl font-semibold">Admin sign in</h1>
        <input className="field" type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input className="field" type="password" placeholder="Password" aria-label="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
        <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

const fmt = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function StatusSelect({ value, options, onChange }) {
  return <select className="field w-auto! py-1! text-xs" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Status">{options.map((o) => <option key={o}>{o}</option>)}</select>;
}

function Table({ token, tab, onAuthFail }) {
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState("");
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    setRows(null); setErr("");
    try { setRows((await api(token, `${tab.path}?limit=100${filter ? `&type=${filter}` : ""}`)).items); }
    catch (e) { if (e.status === 401) onAuthFail(); else setErr(e.message); }
  }, [token, tab.path, filter, onAuthFail]);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    try { await api(token, `${tab.path}/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); setRows((r) => r.map((x) => (x._id === id ? { ...x, status } : x))); }
    catch (e) { setErr(e.message); }
  }
  async function resume(id, name) {
    const res = await fetch(`${API_URL}/api/admin/applications/${id}/resume`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return setErr("Could not download resume");
    const url = URL.createObjectURL(await res.blob());
    Object.assign(document.createElement("a"), { href: url, download: name || "resume" }).click(); URL.revokeObjectURL(url);
  }

  const cols = {
    enquiries: ["Name", "Email", "Phone", "Company", "Requirement", "Type", "Date", "Status"],
    health: ["Business", "Contact", "Email", "Score", "Challenges", "Date", "Status"],
    leads: ["Name", "Company", "Email", "Phone", "Date", "Status"],
    applications: ["Name", "Email", "Phone", "Position", "Resume", "Date", "Status"],
  }[tab.id];

  const cells = (r) => {
    const st = <StatusSelect value={r.status} options={tab.id === "applications" ? APP_STATUSES : STATUSES} onChange={(s) => setStatus(r._id, s)} />;
    switch (tab.id) {
      case "enquiries": return [r.name, r.email, r.phone || "–", r.company || "–", r.requirement || "–", r.type, fmt(r.createdAt), st];
      case "health": return [r.business?.name, r.business?.contactName, r.business?.email, r.score, (r.challenges?.topChallenges || []).join(", ") || "–", fmt(r.createdAt), st];
      case "leads": return [r.name, r.company || "–", r.email, r.phone || "–", fmt(r.createdAt), st];
      default: return [r.name, r.email, r.phone || "–", r.position, <button key="r" className="text-gold underline" onClick={() => resume(r._id, r.resumeOriginalName)}>Download</button>, fmt(r.createdAt), st];
    }
  };

  return (
    <div>
      {tab.id === "enquiries" && (
        <div className="mb-4 flex gap-2">{[["", "All"], ["contact", "Contact"], ["consultation", "Consultation"]].map(([v, l]) => <button key={v} onClick={() => setFilter(v)} className={`rounded-full border px-4 py-1.5 text-sm ${filter === v ? "border-gold text-gold" : "border-white/15 text-zinc-400"}`}>{l}</button>)}</div>
      )}
      {err && <p role="alert" className="mb-3 text-sm text-red-400">{err}</p>}
      {rows === null ? <p className="text-muted">Loading…</p> : rows.length === 0 ? <p className="py-10 text-center text-muted">No records yet.</p> : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400"><tr>{cols.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/5">{rows.map((r) => <tr key={r._id} className="hover:bg-white/3">{cells(r).map((c, i) => <td key={i} className="px-4 py-3 align-top">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const logout = useCallback(() => { sessionStorage.removeItem("riyadvi_admin"); setToken(null); }, []);

  useEffect(() => { setToken(sessionStorage.getItem("riyadvi_admin")); setReady(true); }, []);
  useEffect(() => {
    if (!token || tab !== "dashboard") return;
    api(token, "stats").then(setStats).catch((e) => e.status === 401 && logout());
  }, [token, tab, logout]);

  if (!ready) return null;
  if (!token) return <Login onToken={setToken} />;
  const cur = TABS.find((t) => t.id === tab);
  const cards = stats && [["Total enquiries", stats.totalEnquiries], ["Consultation requests", stats.consultations], ["Health Checkup leads", stats.health], ["Lead Magnet leads", stats.leads], ["Job applications", stats.applications]];

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4"><Logo /><button onClick={logout} className="btn btn-ghost py-2! text-sm">Sign out</button></header>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Admin sections">
          {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`rounded-full border px-4 py-2 text-sm ${tab === t.id ? "border-gold bg-gold/10 text-gold-light" : "border-white/15 text-zinc-300"}`}>{t.label}</button>)}
        </nav>
        {tab === "dashboard" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(cards || Array.from({ length: 5 }, () => ["…", "–"])).map(([l, n], i) => <div key={i} className="glass rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-zinc-400">{l}</p><p className="mt-2 font-display text-4xl font-semibold text-gold">{n}</p></div>)}
          </div>
        ) : <Table key={cur.id} token={token} tab={cur} onAuthFail={logout} />}
      </div>
    </div>
  );
}
