"use client";
import { useState } from "react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** POST JSON or FormData. Resolves { ok, data, message, errors } and never throws. */
export async function submit(path, body) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      method: "POST",
      headers: isForm ? undefined : { "Content-Type": "application/json" },
      body: isForm ? body : JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errors = {};
      (json.errors || []).forEach((e) => { errors[e.field] = e.message; });
      return { ok: false, message: json.message || "Something went wrong", errors };
    }
    return { ok: true, data: json.data, message: json.message };
  } catch {
    return { ok: false, message: "Could not reach the server. Please try again in a moment.", errors: {} };
  }
}

/** Small form state helper: values, field errors, status and submit handler. */
export function useSubmit(path, { validate, transform } = {}) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);

  async function run(values) {
    const local = validate ? validate(values) : {};
    if (Object.keys(local).length) { setErrors(local); setStatus("error"); setMessage("Please fix the highlighted fields."); return false; }
    setStatus("loading"); setErrors({}); setMessage("");
    const res = await submit(path, transform ? transform(values) : values);
    if (res.ok) { setStatus("success"); setMessage(res.message); setData(res.data); return true; }
    setStatus("error"); setErrors(res.errors || {}); setMessage(res.message);
    return false;
  }
  return { run, status, errors, message, data, setErrors };
}

export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
