"use client";
import { useEffect, useRef } from "react";

/**
 * Normalised pointer (-1..1) tracked on the window, so 3D scenes react to the cursor even when
 * HTML content sits on top of the canvas. On touch devices that report orientation (Android,
 * iOS where permission is already granted) the device tilt drives the same values.
 */
export function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const tilt = (e) => {
      if (e.gamma == null || e.beta == null) return;
      p.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
      p.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, []);
  return p;
}
