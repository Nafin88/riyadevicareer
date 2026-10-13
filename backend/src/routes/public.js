const router = require("express").Router();
const { z } = require("zod");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { Enquiry, HealthCheckup, LeadMagnet, Application } = require("../models");
const { ApiError, asyncHandler, ok, validate, notify } = require("../utils/helpers");

const phone = z.string().trim().regex(/^[+\d][\d\s\-()]{6,18}$/, "Enter a valid phone number").optional().or(z.literal(""));
const email = z.string().trim().email("Enter a valid email address");
const name = z.string().trim().min(2, "Name is too short").max(100);
const text = (max = 2000) => z.string().trim().max(max).optional();

const contactSchema = z.object({
  name, email, phone, company: text(120), requirement: text(120),
  message: z.string().trim().min(5, "Please tell us a little more").max(3000),
});
const consultationSchema = z.object({
  name, email, phone: z.string().trim().min(7, "Phone is required for consultations"), company: text(120),
  requirement: text(120), message: text(3000), preferredTime: text(120),
});
const healthSchema = z.object({
  business: z.object({ name: z.string().trim().min(2), industry: text(100), size: text(50), contactName: name, email, phone }),
  digital: z.object({ hasWebsite: text(20), websiteUrl: text(200), websiteAge: text(50), mobileFriendly: text(20) }).default({}),
  marketing: z.object({ channels: z.array(z.string().max(60)).max(20).default([]), monthlyBudget: text(50), trackingLeads: text(20) }).default({}),
  technology: z.object({ currentStack: text(300), internalTeam: text(50), automationLevel: text(50) }).default({}),
  challenges: z.object({ topChallenges: z.array(z.string().max(100)).max(20).default([]), goals: text(2000), timeline: text(50) }).default({}),
});
const leadSchema = z.object({ name, company: text(120), email, phone: z.string().trim().min(7, "Phone is required") });

function scoreCheckup(d) {
  // Sections are optional in the payload, so read them defensively.
  const digital = d.digital || {}, marketing = d.marketing || {}, technology = d.technology || {};
  let s = 40;
  if (digital.hasWebsite === "yes") s += 15;
  if (digital.mobileFriendly === "yes") s += 10;
  if (marketing.trackingLeads === "yes") s += 10;
  s += Math.min((marketing.channels || []).length * 3, 12);
  if (technology.automationLevel === "high") s += 8;
  else if (technology.automationLevel === "medium") s += 4;
  return Math.min(s, 100);
}

router.post("/contact", validate(contactSchema), asyncHandler(async (req, res) => {
  const doc = await Enquiry.create({ ...req.valid, type: "contact" });
  notify("New contact enquiry", req.valid);
  ok(res, { id: doc._id }, "Thanks! We'll get back to you shortly.", 201);
}));

router.post("/consultation", validate(consultationSchema), asyncHandler(async (req, res) => {
  const doc = await Enquiry.create({ ...req.valid, type: "consultation" });
  notify("New consultation request", req.valid);
  ok(res, { id: doc._id }, "Consultation requested. We'll confirm a slot soon.", 201);
}));

router.post("/health-checkup", validate(healthSchema), asyncHandler(async (req, res) => {
  const score = scoreCheckup(req.valid);
  const doc = await HealthCheckup.create({ ...req.valid, score });
  notify("New Business Health Checkup", { business: req.valid.business.name, email: req.valid.business.email, score });
  ok(res, { id: doc._id, score }, "Checkup received.", 201);
}));

router.post("/lead-magnet", validate(leadSchema), asyncHandler(async (req, res) => {
  const doc = await LeadMagnet.create(req.valid);
  notify("New lead magnet download", req.valid);
  ok(res, { id: doc._id, downloadUrl: process.env.GUIDE_URL || "/downloads/software-project-planning-guide.pdf" }, "Your guide is ready.", 201);
}));

// ---- Career applications (multipart with resume) ----
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = [".pdf", ".doc", ".docx"].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new ApiError(400, "Resume must be a PDF or Word document"), ok);
  },
});
const applicationSchema = z.object({ name, email, phone, position: z.string().trim().min(2), jobSlug: text(120), message: text(3000) });

router.post("/applications", upload.single("resume"), (req, res, next) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(422, "Validation failed", parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }))));
  if (!req.file) return next(new ApiError(422, "Validation failed", [{ field: "resume", message: "Resume is required" }]));
  req.valid = parsed.data;
  next();
}, asyncHandler(async (req, res) => {
  const doc = await Application.create({ ...req.valid, resumePath: req.file.filename, resumeOriginalName: req.file.originalname });
  notify("New job application", { ...req.valid, resume: req.file.originalname });
  ok(res, { id: doc._id }, "Application submitted. Good luck!", 201);
}));

module.exports = router;
