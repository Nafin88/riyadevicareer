"use client";
import Link from "next/link";
import { Fragment } from "react";
import { motion } from "motion/react";
import { HeroVisual } from "./visuals";

const words = ["Custom", "Software", "&", "Digital", "Solutions", "to", "Grow", "Your", "Business"];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden pt-24">
      <div className="grid-bg absolute inset-0 -z-20 opacity-60" aria-hidden />
      <div className="glow-orb -z-10 -left-[10%] top-1/4 h-96 w-96 bg-gold/15" aria-hidden />
      <HeroVisual className="absolute inset-0 -z-10 md:left-[22%]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black via-black/60 to-transparent md:via-black/30" aria-hidden />

      <div className="container-x relative">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-light">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /> Technology &amp; Digital Solutions Partner · Since 2021
        </motion.p>

        <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span initial={{ opacity: 0, y: 40, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={`inline-block ${i >= 6 ? "gold-text" : ""}`}>{w}</motion.span>{" "}
            </Fragment>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
          Web &amp; App Development, UI/UX Design, and Business Strategy – all tailored to your needs.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact?intent=consultation" className="btn btn-gold">Book a Free Consultation</Link>
          <Link href="#solutions" className="btn btn-ghost" onClick={(e) => {
            const el = document.getElementById("solutions");
            if (el) { e.preventDefault(); window.__lenis ? window.__lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView({ behavior: "smooth" }); }
          }}>Explore Our Solutions</Link>
        </motion.div>

        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
          {[["2021", "Founded"], ["6", "Core services"], ["10+", "Client projects"]].map(([n, l]) => (
            <div key={l}><dt className="font-display text-2xl font-semibold text-gold">{n}</dt><dd className="text-xs text-muted">{l}</dd></div>
          ))}
        </motion.dl>
      </div>

      <div className="absolute inset-x-0 bottom-6 hidden justify-center md:flex" aria-hidden>
        <div className="h-10 w-6 rounded-full border border-white/25 p-1"><motion.div animate={{ y: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="h-2 w-full rounded-full bg-gold" /></div>
      </div>
    </section>
  );
}
