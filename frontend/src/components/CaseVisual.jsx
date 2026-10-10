"use client";
import dynamic from "next/dynamic";
import Scene3D from "./Scene3D";

const CaseScene = dynamic(() => import("./canvas/CaseScene"), { ssr: false });

export default function CaseVisual({ project }) {
  return (
    <div className="glass relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[16/8]" style={{ boxShadow: `0 30px 90px -40px ${project.accent}` }}>
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <Scene3D Scene={CaseScene} className="absolute inset-0" fallback={<div className="absolute inset-0 grid place-items-center font-display text-4xl text-gold" aria-hidden>{project.client}</div>} />
      <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur">Interactive 3D · Drag to explore</span>
    </div>
  );
}
