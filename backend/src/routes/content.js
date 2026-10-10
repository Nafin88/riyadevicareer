// Read-only content API. Today it serves JSON files; swap the `load*` functions for
// Mongo models, Strapi, Sanity or WordPress calls without touching the frontend.
const router = require("express").Router();
const { ApiError, asyncHandler, ok } = require("../utils/helpers");

const services = require("../data/services.json");
const portfolio = require("../data/portfolio.json");
const blog = require("../data/blog.json");
const jobs = require("../data/jobs.json");

const loadServices = async () => services;
const loadPortfolio = async () => portfolio;
const loadBlog = async () => blog;
const loadJobs = async () => jobs;

const bySlug = (items, slug, label) => {
  const item = items.find((i) => i.slug === slug);
  if (!item) throw new ApiError(404, `${label} not found`);
  return item;
};

router.get("/services", asyncHandler(async (_req, res) => ok(res, await loadServices())));
router.get("/services/:slug", asyncHandler(async (req, res) => ok(res, bySlug(await loadServices(), req.params.slug, "Service"))));

router.get("/portfolio", asyncHandler(async (_req, res) => ok(res, await loadPortfolio())));
router.get("/portfolio/:slug", asyncHandler(async (req, res) => ok(res, bySlug(await loadPortfolio(), req.params.slug, "Project"))));

router.get("/blog", asyncHandler(async (req, res) => {
  const { q, category, tag } = req.query;
  let items = await loadBlog();
  if (category) items = items.filter((p) => p.category === category);
  if (tag) items = items.filter((p) => p.tags.includes(String(tag)));
  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter((p) => [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(needle));
  }
  ok(res, items);
}));
router.get("/blog/:slug", asyncHandler(async (req, res) => ok(res, bySlug(await loadBlog(), req.params.slug, "Article"))));

router.get("/jobs", asyncHandler(async (req, res) => {
  const { department, designation, experience } = req.query;
  let items = await loadJobs();
  if (department) items = items.filter((j) => j.department === department);
  if (designation) items = items.filter((j) => j.designation === designation);
  if (experience) items = items.filter((j) => j.experience === experience);
  ok(res, items);
}));
router.get("/jobs/:slug", asyncHandler(async (req, res) => ok(res, bySlug(await loadJobs(), req.params.slug, "Job"))));

module.exports = router;
