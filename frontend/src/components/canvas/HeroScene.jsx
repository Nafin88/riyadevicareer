"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { usePointer } from "./usePointer";

const GOLD = "#d4af37";

function fibonacciSphere(n, r) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return pts;
}

/** Connected nodes (a "data network") orbiting a metallic core. */
function Ecosystem({ quality, pointer }) {
  const group = useRef();
  const core = useRef();
  const nodes = useRef();
  const hubs = useRef();
  const count = quality === "lite" ? 38 : 84;
  const R = 2.5;

  const { pts, lines, hubIdx } = useMemo(() => {
    const pts = fibonacciSphere(count, R);
    const spacing = Math.sqrt((4 * Math.PI * R * R) / count);
    const positions = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < spacing * 1.55) positions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const hubIdx = pts.map((_, i) => i).filter((i) => i % 9 === 0);
    return { pts, lines: geo, hubIdx };
  }, [count]);

  useEffect(() => {
    const m = new THREE.Matrix4();
    pts.forEach((p, i) => { m.setPosition(p); nodes.current.setMatrixAt(i, m); });
    nodes.current.instanceMatrix.needsUpdate = true;
  }, [pts]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const scroll = typeof window !== "undefined" ? Math.min(window.scrollY / 900, 1.5) : 0;
    const g = group.current;
    g.rotation.y += dt * 0.12;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.4 + scroll * 0.5, 3, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, pointer.current.x * 0.35, 3, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1 - scroll * 0.18, 4, dt));
    // "hover": the core swells as the cursor approaches the centre of the scene
    const near = 1 - Math.min(Math.hypot(pointer.current.x * 0.8, pointer.current.y), 1);
    core.current.scale.setScalar(THREE.MathUtils.damp(core.current.scale.x, 1 + near * 0.22 + Math.sin(t * 1.5) * 0.02, 5, dt));
    hubs.current.children.forEach((h, i) => h.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.25));
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.25, quality === "lite" ? 3 : 5]} />
        <MeshDistortMaterial color={GOLD} metalness={0.85} roughness={0.32} distort={0.28} speed={1.6} envMapIntensity={1.1} emissive="#5a4208" emissiveIntensity={0.7} />
      </mesh>
      <mesh scale={1.9}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.1} />
      </mesh>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.32} />
      </lineSegments>
      <instancedMesh ref={nodes} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#fff3c4" />
      </instancedMesh>
      <group ref={hubs}>
        {hubIdx.map((i) => (
          <mesh key={i} position={pts[i]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.4} metalness={0.6} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Particles({ quality }) {
  const ref = useRef();
  const n = quality === "lite" ? 90 : 320;
  const positions = useMemo(() => {
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 16;
      a[i * 3 + 1] = (Math.random() - 0.5) * 10;
      a[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return a;
  }, [n]);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.015; ref.current.rotation.x += dt * 0.006; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.035} color={GOLD} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene({ quality, active }) {
  const pointer = usePointer();
  const [dpr, setDpr] = useState(quality === "lite" ? 1 : 1.75);
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: quality === "full", alpha: true, powerPreference: "high-performance" }}
    >
      {/* Drops resolution automatically if the GPU can't hold frame rate */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => quality === "full" && setDpr(1.75)} />
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#fff1c2" />
      <pointLight position={[-6, -3, 2]} intensity={18} color={GOLD} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} scale={[2, 6, 1]} color="#ffd978" />
        <Lightformer form="ring" intensity={3} position={[4, -2, -3]} scale={4} color="#fff" />
        {/* soft warm fill all around so the metal never reflects pure black */}
        <Lightformer form="rect" intensity={1.4} position={[0, 0, -6]} scale={[24, 12, 1]} color="#a3822a" />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 2]} scale={[12, 2, 1]} color="#c9a43a" />
      </Environment>
      <Ecosystem quality={quality} pointer={pointer} />
      <Particles quality={quality} />
    </Canvas>
  );
}
