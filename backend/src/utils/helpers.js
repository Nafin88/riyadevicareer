const nodemailer = require("nodemailer");

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const ok = (res, data, message = "OK", status = 200) => res.status(status).json({ success: true, message, data });

/** Validate req.body with a zod schema; throws a 422 ApiError with field-level details. */
const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
    return next(new ApiError(422, "Validation failed", details));
  }
  req.valid = parsed.data;
  next();
};

let transporter;
function getTransporter() {
  if (transporter !== undefined) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  transporter = SMTP_HOST
    ? nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT) || 587, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined })
    : null;
  return transporter;
}

/** Fire-and-forget notification. Never fails the request; logs when SMTP isn't configured. */
async function notify(subject, lines) {
  const text = Object.entries(lines).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v ?? "-"}`).join("\n");
  const t = getTransporter();
  if (!t) return console.log(`[notify:disabled] ${subject}\n${text}`);
  try {
    await t.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: process.env.NOTIFY_TO, subject: `[Riyadvi] ${subject}`, text });
  } catch (e) {
    console.error("[notify:error]", e.message);
  }
}

module.exports = { ApiError, asyncHandler, ok, validate, notify };
