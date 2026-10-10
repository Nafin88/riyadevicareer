// Content access layer. Components never import JSON directly: they call these functions,
// so the source can move from local JSON to the Express API, Strapi, Sanity or WordPress
// by changing only this file. Set NEXT_PUBLIC_CONTENT_SOURCE=api to read from the backend.
import servicesData from "@/data/services.json";
import portfolioData from "@/data/portfolio.json";
import blogData from "@/data/blog.json";
import jobsData from "@/data/jobs.json";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const USE_API = process.env.NEXT_PUBLIC_CONTENT_SOURCE === "api";

async function load(path, fallback) {
  if (!USE_API) return fallback;
  try {
    const res = await fetch(`${API}/api/${path}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()).data;
  } catch {
    return fallback; // keep the site up even if the API is unreachable
  }
}

export const getServices = () => load("services", servicesData);
export const getService = async (slug) => (await getServices()).find((s) => s.slug === slug);

export const getProjects = () => load("portfolio", portfolioData);
export const getProject = async (slug) => (await getProjects()).find((p) => p.slug === slug);

export const getPosts = () => load("blog", blogData);
export const getPost = async (slug) => (await getPosts()).find((p) => p.slug === slug);

export const getJobs = () => load("jobs", jobsData);
export const getJob = async (slug) => (await getJobs()).find((j) => j.slug === slug);

export const SITE = {
  name: "Riyadvi Software Technologies",
  url: "https://www.riyadvisoftwaretechnologies.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
};
