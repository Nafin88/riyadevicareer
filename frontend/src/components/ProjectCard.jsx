"use client";
import Link from "next/link";
import { useRef } from "react";

/** Portfolio card with a cursor-following 3D tilt and spotlight. */
export default function ProjectCard({ project, priority = false }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 10}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`);
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block" aria-label={`${project.client} case study`}>
      <article ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-200 ease-out will-change-transform">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${project.accent}22, transparent 60%)` }} />
        <div className="relative aspect-16/10 overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${project.accent}55, #000 70%)` }}>
          <div className="absolute inset-0 grid-bg opacity-60" />
          <span className="absolute bottom-3 left-4 font-display text-3xl font-semibold text-white/90">{project.client}</span>
          {project.interactive && <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">Interactive 3D</span>}
        </div>
        <div className="relative mt-5">
          <p className="text-xs uppercase tracking-widest text-gold">{project.industry}</p>
          <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">View case study →</span>
        </div>
      </article>
    </Link>
  );
}
