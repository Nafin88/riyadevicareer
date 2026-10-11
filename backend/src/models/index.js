const mongoose = require("mongoose");
const { Schema } = mongoose;

const STATUS = ["new", "contacted", "qualified", "closed"];
const opts = { timestamps: true };

// Contact enquiries + consultation requests share one shape; `type` tells them apart.
const Enquiry = mongoose.model(
  "Enquiry",
  new Schema(
    {
      type: { type: String, enum: ["contact", "consultation"], default: "contact", index: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, trim: true },
      company: { type: String, trim: true },
      requirement: { type: String, trim: true },
      message: { type: String, trim: true },
      preferredTime: { type: String, trim: true },
      status: { type: String, enum: STATUS, default: "new" },
    },
    opts
  )
);

const HealthCheckup = mongoose.model(
  "HealthCheckup",
  new Schema(
    {
      business: { name: String, industry: String, size: String, contactName: String, email: String, phone: String },
      digital: { hasWebsite: String, websiteUrl: String, websiteAge: String, mobileFriendly: String },
      marketing: { channels: [String], monthlyBudget: String, trackingLeads: String },
      technology: { currentStack: String, internalTeam: String, automationLevel: String },
      challenges: { topChallenges: [String], goals: String, timeline: String },
      score: Number,
      status: { type: String, enum: STATUS, default: "new" },
    },
    opts
  )
);

const LeadMagnet = mongoose.model(
  "LeadMagnet",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      company: { type: String, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, trim: true },
      resource: { type: String, default: "software-project-planning-guide" },
      status: { type: String, enum: STATUS, default: "new" },
    },
    opts
  )
);

const Application = mongoose.model(
  "Application",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, trim: true },
      position: { type: String, required: true, trim: true },
      jobSlug: { type: String, trim: true },
      message: { type: String, trim: true },
      resumePath: { type: String },
      resumeOriginalName: { type: String },
      status: { type: String, enum: ["new", "reviewing", "shortlisted", "rejected", "hired"], default: "new" },
    },
    opts
  )
);

// No MONGODB_URI => fall back to a JSON-file store (local development / demos only).
const useFile = !process.env.MONGODB_URI;
if (useFile) {
  const { createLocalModel } = require("../utils/localStore");
  module.exports = {
    Enquiry: createLocalModel("enquiries", { type: "contact", status: "new" }),
    HealthCheckup: createLocalModel("healthcheckups", { status: "new" }),
    LeadMagnet: createLocalModel("leadmagnets", { resource: "software-project-planning-guide", status: "new" }),
    Application: createLocalModel("applications", { status: "new" }),
    STATUS,
    useFile,
  };
} else {
  module.exports = { Enquiry, HealthCheckup, LeadMagnet, Application, STATUS, useFile };
}
