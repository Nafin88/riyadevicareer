"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="glass group block h-full rounded-2xl p-6 transition-colors hover:border-gold/50">
      <p className="text-xs uppercase tracking-widest text-gold">{post.category}</p>
      <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-gold-light">{post.title}</h3>
      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
      <p className="mt-4 text-xs text-zinc-500">{new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {post.readTime} min read</p>
    </Link>
  );
}

export default function BlogBrowser({ posts }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [tag, setTag] = useState("");
  const categories = useMemo(() => ["All", ...new Set(posts.map((p) => p.category))], [posts]);
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))], [posts]);
  const featured = posts.find((p) => p.featured) || posts[0];

  const list = posts.filter((p) =>
    (cat === "All" || p.category === cat) && (!tag || p.tags.includes(tag)) &&
    (!q || [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(q.toLowerCase())));
  const filtering = q || tag || cat !== "All";

  return (
    <div>
      {!filtering && featured && (
        <Link href={`/blog/${featured.slug}`} className="glass glass-gold group mb-10 block rounded-3xl p-8 md:p-12">
          <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-black">Featured</span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold md:text-4xl">{featured.title}</h2>
          <p className="mt-3 max-w-2xl text-muted">{featured.excerpt}</p>
          <span className="mt-6 inline-block text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">Read article →</span>
        </Link>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          {categories.map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-gold bg-gold/15 text-gold-light" : "border-white/15 text-zinc-300 hover:border-white/40"}`}>{c}</button>)}
        </div>
        <input type="search" aria-label="Search articles" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} className="field md:max-w-xs" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((t) => <button key={t} onClick={() => setTag(tag === t ? "" : t)} aria-pressed={tag === t} className={`text-xs ${tag === t ? "text-gold" : "text-zinc-500 hover:text-zinc-300"}`}>#{t}</button>)}
      </div>

      {list.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.slug} post={p} />)}</div>
      ) : <p className="py-16 text-center text-muted">No articles match your filters.</p>}
    </div>
  );
}
