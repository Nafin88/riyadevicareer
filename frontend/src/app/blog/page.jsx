import BlogBrowser from "@/components/BlogBrowser";
import { PageHero } from "@/components/ui";
import { getPosts } from "@/lib/content";

export const metadata = { title: "Blog", description: "Insights on software, design, 3D and digital growth from the Riyadvi team." };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Ideas for building and <span className="gold-text">growing digitally</span></>}>Practical articles on technology, design, marketing and strategy.</PageHero>
      <section className="container-x"><BlogBrowser posts={posts} /></section>
    </>
  );
}
