"use client";
import { ServiceVisual } from "./visuals";

export default function ServiceHeroVisual({ service }) {
  return (
    <div className="glass relative aspect-square overflow-hidden rounded-3xl sm:aspect-4/3 lg:aspect-square">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <ServiceVisual kind={service.visual} title={service.title} className="absolute inset-0" />
    </div>
  );
}
