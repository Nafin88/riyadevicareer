"use client";
import Link from "next/link";
import { motion } from "motion/react";

export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Tag>
  );
}

export function SectionHeading({ eyebrow, title, children, center = false, className = "" }) {
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{children}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, children, actions }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
      <div className="glow-orb -top-24 left-1/2 h-72 w-144 -translate-x-1/2 bg-gold/20" aria-hidden />
      <div className="container-x relative">
        {eyebrow && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</motion.p>}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl text-4xl font-semibold leading-[1.1] md:text-6xl">{title}</motion.h1>
        {children && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{children}</motion.p>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function CTABand({ title = "Ready to build something remarkable?", text = "Tell us about your goals and we'll map the fastest route to growth.", primary = { href: "/contact?intent=consultation", label: "Book a Free Consultation" }, secondary = { href: "/business-health-checkup", label: "Take the Business Health Checkup" } }) {
  return (
    <section className="container-x mt-24">
      <Reveal className="glass glass-gold relative overflow-hidden rounded-3xl p-8 text-center md:p-16">
        <div className="glow-orb -bottom-24 left-1/2 h-60 w-96 -translate-x-1/2 bg-gold/25" aria-hidden />
        <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold md:text-5xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted">{text}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className="btn btn-gold">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="btn btn-ghost">{secondary.label}</Link>}
        </div>
      </Reveal>
    </section>
  );
}

export function Field({ label, name, error, as = "input", children, required, className = "", ...rest }) {
  const id = `f-${name}`;
  const Tag = as;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-300">{label}{required && <span className="text-gold"> *</span>}</label>
      <Tag id={id} name={name} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="field" {...rest}>{children}</Tag>
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function FormStatus({ status, message }) {
  if (!message) return null;
  const good = status === "success";
  return (
    <p role={good ? "status" : "alert"} className={`rounded-xl border px-4 py-3 text-sm ${good ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-red-500/40 bg-red-500/10 text-red-300"}`}>{message}</p>
  );
}
