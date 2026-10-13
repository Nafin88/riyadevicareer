"use client";
import dynamic from "next/dynamic";
import Scene3D from "./Scene3D";
import { TECH } from "@/data/tech";

// three.js is code-split: each scene is its own chunk, loaded only when a section nears the viewport.
const HeroScene = dynamic(() => import("./canvas/HeroScene"), { ssr: false });
const ServiceScene = dynamic(() => import("./canvas/ServiceScene"), { ssr: false });
const TechSphere = dynamic(() => import("./canvas/TechSphere"), { ssr: false });

/* Lightweight CSS/SVG fallbacks: used while 3D loads, on reduced-motion and when WebGL is unavailable. */
function HeroFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="relative h-64 w-64 md:h-96 md:w-96">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f3dc85,#d4af37_40%,#4a3a08_75%,#000)] opacity-90 blur-[1px]" />
        <div className="absolute -inset-8 rounded-full border border-gold/30" />
        <div className="absolute -inset-16 rounded-full border border-gold/15" />
      </div>
    </div>
  );
}

function ServiceFallback({ title }) {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="grid h-24 w-24 place-items-center rounded-2xl border border-gold/30 bg-linear-to-br from-gold/20 to-transparent font-display text-3xl font-semibold text-gold">{title?.[0] ?? "R"}</div>
    </div>
  );
}

function TechFallback() {
  return (
    <ul className="absolute inset-0 flex flex-wrap content-center justify-center gap-2 p-4">
      {TECH.map((t) => <li key={t.name} className="rounded-full border border-gold/30 bg-black/60 px-3 py-1 text-xs text-gold-light">{t.name}</li>)}
    </ul>
  );
}

export function HeroVisual({ className = "" }) {
  return <Scene3D Scene={HeroScene} fallback={<HeroFallback />} className={className} margin="0px" />;
}

export function ServiceVisual({ kind, title, className = "" }) {
  return <Scene3D Scene={ServiceScene} kind={kind} fallback={<ServiceFallback title={title} />} className={className} />;
}

export function TechVisual({ className = "" }) {
  return <Scene3D Scene={TechSphere} fallback={<TechFallback />} className={className} />;
}
