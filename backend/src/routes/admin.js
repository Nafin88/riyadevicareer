const router = require("express").Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { Enquiry, HealthCheckup, LeadMagnet, Application, STATUS } = require("../models");
const { signToken, requireAdmin } = require("../middleware/auth");
const { ApiError, asyncHandler, ok, validate } = require("../utils/helpers");

router.post("/login", validate(z.object({ email: z.string().email(), password: z.string().min(1) })), asyncHandler(async (req, res) => {
  const { email, password } = req.valid;
  const adminEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const valid = adminEmail && email.toLowerCase() === adminEmail.toLowerCase() &&
    (hash ? await bcrypt.compare(password, hash) : password === process.env.ADMIN_PASSWORD);
  if (!valid) throw new ApiError(401, "Invalid credentials");
  ok(res, { token: signToken(email) }, "Logged in");
}));

router.use(requireAdmin);

router.get("/stats", asyncHandler(async (_req, res) => {
  const [enquiries, consultations, health, leads, applications] = await Promise.all([
    Enquiry.countDocuments({ type: "contact" }),
    Enquiry.countDocuments({ type: "consultation" }),
    HealthCheckup.countDocuments(),
    LeadMagnet.countDocuments(),
    Application.countDocuments(),
  ]);
  ok(res, { enquiries, consultations, health, leads, applications, totalEnquiries: enquiries + consultations });
}));

const list = (Model, extraFilter = () => ({})) => asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 25);
  const filter = { ...extraFilter(req) };
  if (req.query.status) filter.status = String(req.query.status);
  const [items, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(filter),
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) });
});

router.get("/enquiries", list(Enquiry, (req) => (req.query.type ? { type: String(req.query.type) } : {})));
router.get("/health-checkups", list(HealthCheckup));
router.get("/lead-magnets", list(LeadMagnet));
router.get("/applications", list(Application));

const models = { enquiries: Enquiry, "health-checkups": HealthCheckup, "lead-magnets": LeadMagnet, applications: Application };
router.patch("/:collection/:id/status", asyncHandler(async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) throw new ApiError(404, "Unknown collection");
  const allowed = req.params.collection === "applications" ? ["new", "reviewing", "shortlisted", "rejected", "hired"] : STATUS;
  const status = String(req.body.status);
  if (!allowed.includes(status)) throw new ApiError(422, `Status must be one of: ${allowed.join(", ")}`);
  const doc = await Model.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!doc) throw new ApiError(404, "Record not found");
  ok(res, doc, "Status updated");
}));

router.get("/applications/:id/resume", asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app?.resumePath) throw new ApiError(404, "Resume not found");
  res.download(path.join(__dirname, "../../uploads", path.basename(app.resumePath)), app.resumeOriginalName);
}));

module.exports = router;
