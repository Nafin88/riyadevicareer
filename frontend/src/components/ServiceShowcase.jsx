"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ServiceVisual } from "./visuals";

const HINT = { model: "Drag to rotate", browser: "Move your cursor", phone: "Move your cursor", growth: "Watch it grow", immersive: "Move your cursor", interface: "Move your cursor" };

/**
 * One shared 3D stage that swaps its scene as the user hovers or taps a service.
 * A single WebGL context for six visuals keeps GPU cost low on laptops and phones.
 */
export default function ServiceShowcase({ services }) {
  const [i, setI] = useState(0);
  const s = services[i];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
      <ul className="order-2 space-y-2 lg:order-1" role="tablist" aria-label="Services">
        {services.map((sv, idx) => (
          <li key={sv.slug}>
            <button role="tab" aria-selected={idx === i} onMouseEnter={() => setI(idx)} onFocus={() => setI(idx)} onClick={() => setI(idx)}
              className={`group w-full rounded-2xl border p-4 text-left transition-all md:p-5 ${idx === i ? "glass glass-gold" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={`font-display text-sm ${idx === i ? "text-gold" : "text-zinc-600"}`}>0{idx + 1}</span>
                  <h3 className="text-lg font-semibold md:text-xl">{sv.title}</h3>
                </div>
                <span className={`transition-transform ${idx === i ? "translate-x-0 text-gold" : "-translate-x-2 text-zinc-600"}`} aria-hidden>→</span>
              </div>
              <AnimatePresence initial={false}>
                {idx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="pt-3 text-sm leading-relaxed text-muted">{sv.tagline}</p>
                    <Link href={`/services/${sv.slug}`} className="mt-3 inline-block text-sm font-semibold text-gold hover:text-gold-light">Explore {sv.title} →</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </li>
        ))}
      </ul>

      <div className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
        <div className="glass relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-square">
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
          <ServiceVisual kind={s.visual} title={s.title} className="absolute inset-0" />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur">{s.title} · {HINT[s.visual]}</span>
        </div>
      </div>
    </div>
  );
}
