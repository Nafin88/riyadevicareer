import { getJobs, getPosts, getProjects, getServices, SITE } from "@/lib/content";

export default async function sitemap() {
  const [s, p, b, j] = await Promise.all([getServices(), getProjects(), getPosts(), getJobs()]);
  const fixed = ["", "/services", "/portfolio", "/about", "/blog", "/careers", "/contact", "/business-health-checkup", "/software-project-planning-guide"];
  return [
    ...fixed.map((u) => ({ url: `${SITE.url}${u}` })),
    ...s.map((x) => ({ url: `${SITE.url}/services/${x.slug}` })),
    ...p.map((x) => ({ url: `${SITE.url}/portfolio/${x.slug}` })),
    ...b.map((x) => ({ url: `${SITE.url}/blog/${x.slug}` })),
    ...j.map((x) => ({ url: `${SITE.url}/careers/${x.slug}` })),
  ];
}
