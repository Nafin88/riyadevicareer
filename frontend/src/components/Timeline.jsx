"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MILESTONES } from "@/data/tech";
import { Reveal } from "./ui";

/** Vertical milestone timeline whose gold spine fills as you scroll. */
export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <div ref={ref} className="relative mx-auto max-w-3xl pl-8 md:pl-0">
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 md:left-1/2" aria-hidden />
      <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-b from-gold-light to-gold-dark md:left-1/2" aria-hidden />
      <ol className="space-y-12">
        {MILESTONES.map((m, i) => (
          <li key={m.year} className="relative md:grid md:grid-cols-2 md:gap-14">
            <span className="absolute -left-8 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-gold bg-black md:left-1/2 md:-translate-x-1/2" aria-hidden><span className="h-2 w-2 rounded-full bg-gold" /></span>
            <Reveal className={i % 2 ? "md:col-start-2" : "md:text-right"} y={20}>
              <p className="font-display text-3xl font-semibold text-gold">{m.year}</p>
              <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
