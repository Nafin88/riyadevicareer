"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STEPS } from "@/data/tech";
import { Reveal } from "./ui";

const pts = STEPS.map((_, i) => ({ x: 40 + i * 64, y: 210 - i * 34 }));
const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");

/**
 * Scroll-driven story: on desktop the section is pinned by GSAP ScrollTrigger and scrubbed
 * through six steps (Challenge → Growth). On mobile it degrades to a normal vertical list.
 */
export default function Transformation() {
  const root = useRef(null);
  const line = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // 1) decide layout from the media query (desktop + motion allowed => pinned storytelling)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const on = () => setPinned(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // 2) once the pinned layout is rendered, create the ScrollTrigger against the stable root element
  useEffect(() => {
    if (!pinned) return;
    gsap.registerPlugin(ScrollTrigger);
    const L = line.current.getTotalLength();
    gsap.set(line.current, { strokeDasharray: L, strokeDashoffset: L });
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: `+=${STEPS.length * 60}%`, pin: true, scrub: true, anticipatePin: 1,
      onUpdate: (self) => {
        setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
        gsap.set(line.current, { strokeDashoffset: L * (1 - self.progress) });
      },
    });
    return () => st.kill();
  }, [pinned]);

  // One stable root element for both layouts so the ScrollTrigger pin target never changes.
  return (
    <div ref={root} className={pinned ? "relative flex h-screen items-center overflow-hidden" : ""}>
      {!pinned ? (
        <div className="container-x space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04} className="glass flex gap-4 rounded-2xl p-5">
              <span className="font-display text-3xl font-semibold text-gold">0{i + 1}</span>
              <div><h3 className="text-lg font-semibold">{s.title}</h3><p className="mt-1 text-sm text-muted">{s.text}</p></div>
            </Reveal>
          ))}
        </div>
      ) : (
      <div className="container-x grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 font-display text-sm text-gold">Step 0{active + 1} / 0{STEPS.length}</p>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <h3 className="text-4xl font-semibold lg:text-6xl"><span className="gold-text">{STEPS[active].title}</span></h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-300">{STEPS[active].text}</p>
            </motion.div>
          </AnimatePresence>
          <ol className="mt-10 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`rounded-full border px-3 py-1 text-xs transition-colors ${i <= active ? "border-gold/60 bg-gold/10 text-gold-light" : "border-white/10 text-zinc-500"}`}>{s.title}</li>
            ))}
          </ol>
        </div>

        <div className="glass relative aspect-[4/3] rounded-3xl p-4">
          <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="Growth path from business challenge to growth">
            <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#9c7c1a" /><stop offset="1" stopColor="#f3dc85" /></linearGradient></defs>
            <path d={path} stroke="rgba(255,255,255,.12)" strokeWidth="2" fill="none" strokeDasharray="4 6" />
            <path ref={line} d={path} stroke="url(#g)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <g key={i}>
                <motion.circle cx={p.x} cy={p.y} animate={{ r: i === active ? 13 : 7, fill: i <= active ? "#d4af37" : "#27272a" }} stroke="#000" strokeWidth="3" />
                {i === active && <motion.circle cx={p.x} cy={p.y} initial={{ r: 13, opacity: 0.6 }} animate={{ r: 28, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.6 }} fill="#d4af37" />}
                <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize="10" fill={i <= active ? "#f3dc85" : "#71717a"}>{i + 1}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      )}
    </div>
  );
}
