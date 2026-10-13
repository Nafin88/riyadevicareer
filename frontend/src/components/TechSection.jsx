"use client";
import { TechVisual } from "./visuals";

export default function TechSection() {
  return (
    <div className="glass relative mx-auto aspect-square max-w-xl overflow-hidden rounded-4xl sm:aspect-4/3 md:max-w-none md:aspect-16/9">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
      <TechVisual className="absolute inset-0" />
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur">Drag to explore the stack</span>
    </div>
  );
}
