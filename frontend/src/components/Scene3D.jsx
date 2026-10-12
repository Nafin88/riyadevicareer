"use client";
import { useRef } from "react";
import { useInView } from "motion/react";
import { useQuality } from "@/lib/useQuality";

/**
 * Mounts a 3D scene only when it is near the viewport and the device can handle it.
 * - `Scene` is a next/dynamic component (ssr:false) so three.js is code-split per scene.
 * - `quality` ("full" | "lite") and `active` (in view) are passed down so scenes can lower
 *   DPR / object counts and pause rendering when scrolled away.
 * - `fallback` is shown while loading, on reduced-motion, or without WebGL.
 */
export default function Scene3D({ Scene, fallback, className = "", margin = "200px", ...props }) {
  const ref = useRef(null);
  const near = useInView(ref, { margin, once: false });
  const seen = useRef(false);
  if (near) seen.current = true;
  const quality = useQuality();
  const showScene = quality && quality !== "static" && seen.current;

  return (
    // Only default to `relative` when the caller hasn't chosen a position (else the classes fight and the box collapses).
    <div ref={ref} className={`${/\b(absolute|fixed|relative|sticky)\b/.test(className) ? "" : "relative"} ${className}`}>
      {showScene ? <Scene quality={quality} active={near} {...props} /> : fallback}
    </div>
  );
}
