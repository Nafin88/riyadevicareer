require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
const origins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map((s) => s.trim());
// In development, accept any localhost / 127.0.0.1 port so a changed Next.js port never breaks the API.
const isLocal = (o) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o || "");
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || origins.includes("*") || origins.includes(origin) || (process.env.NODE_ENV !== "production" && isLocal(origin))),
  credentials: true,
}));
app.use(express.json({ limit: "200kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => res.json({ name: "Riyadvi API", status: "ok" }));
app.get("/api/health", (_req, res) => res.json({ success: true, db: !process.env.MONGODB_URI ? "local-file" : mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many requests, please try again later." } });
app.use("/api", submitLimiter, require("./routes/public"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api", require("./routes/content"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
async function start() {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = require("crypto").randomBytes(32).toString("hex");
    console.warn("JWT_SECRET not set - using a temporary secret (admin sessions reset on restart).");
  }
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (e) {
      console.error("MongoDB connection failed:", e.message);
    }
  } else {
    console.warn("MONGODB_URI not set - using local JSON file storage in backend/data (development only).");
  }
  app.listen(PORT, () => console.log(`Riyadvi API listening on :${PORT}`));
}
if (require.main === module) start();
module.exports = app;
