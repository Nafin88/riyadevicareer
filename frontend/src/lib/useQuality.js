"use client";
import { useEffect, useState } from "react";

/**
 * Decides how much 3D a device should render.
 *  "full"   - desktop-class GPU: dense scenes, DPR up to 2
 *  "lite"   - phones / low-core devices: fewer objects, DPR 1, no post effects
 *  "static" - reduced-motion users or no WebGL: skip the canvas, show the fallback
 */
export function useQuality() {
  const [quality, setQuality] = useState(null); // null until mounted (avoids hydration mismatch)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}
    const saveData = navigator.connection?.saveData;
    const small = window.innerWidth < 768;
    const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    if (reduced || !webgl || saveData) setQuality("static");
    else if (small || weak) setQuality("lite");
    else setQuality("full");
  }, []);

  return quality;
}
