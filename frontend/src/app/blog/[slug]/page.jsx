import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/BlogBrowser";
import { CTABand } from "@/components/ui";
import { getPost, getPosts } from "@/lib/content";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  // Related = same category or shared tags, best match first
  const related = all.filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.p);

  return (
    <>
      <article className="container-x max-w-3xl pt-32 md:pt-40">
        <Link href="/blog" className="text-sm text-muted hover:text-gold">← All articles</Link>
        <p className="mt-6 text-xs uppercase tracking-widest text-gold">{post.category}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-zinc-500">{post.author} · {new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "long" })} · {post.readTime} min read</p>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-zinc-300">{post.content.map((para, i) => <p key={i}>{para}</p>)}</div>
        <div className="mt-10 flex flex-wrap gap-2">{post.tags.map((t) => <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">#{t}</span>)}</div>
      </article>
      <section className="container-x pt-20">
        <h2 className="mb-6 text-xl font-semibold">Related articles</h2>
        <div className="grid gap-5 md:grid-cols-3">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
      </section>
      <CTABand />
    </>
  );
}
