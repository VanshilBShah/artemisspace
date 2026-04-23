import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Earth, Moon, Orion } from "./SpaceScene";

type Props = {
  /** Scroll progress 0..1 across the homepage */
  progressRef: React.MutableRefObject<number>;
};

// Smoothstep-like easing
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/**
 * Stages along the scroll (progress p in 0..1):
 *  0.00 → Earth fills view (hero)
 *  0.20 → Camera pulls back, Earth shifts left
 *  0.40 → Trajectory drawing toward Moon
 *  0.60 → Orion capsule visible mid-flight
 *  0.80 → Moon fills view
 *  1.00 → Final lunar approach
 */
function Rig({ progressRef }: Props) {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const earthGroup = useRef<THREE.Group>(null);
  const moonGroup = useRef<THREE.Group>(null);
  const orionGroup = useRef<THREE.Group>(null);
  const trajRef = useRef<THREE.Line>(null);
  const smoothed = useRef(0);

  // Trajectory curve from Earth (left) to Moon (right)
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-1.5, 1.4, 0.5),
      new THREE.Vector3(0.5, 1.8, 0.2),
      new THREE.Vector3(2.5, 1.2, -0.3),
      new THREE.Vector3(4.2, 0.2, 0),
    ]);
  }, []);

  const trajGeom = useMemo(() => {
    const pts = curve.getPoints(120);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setDrawRange(0, 0);
    return g;
  }, [curve]);

  useFrame((state, dt) => {
    // Smooth scroll progress
    const target = progressRef.current;
    smoothed.current = lerp(smoothed.current, target, Math.min(1, dt * 4));
    const p = smoothed.current;

    // Earth: starts large + centered, drifts left & shrinks
    if (earthGroup.current) {
      const s = lerp(2.4, 0.7, ease(clamp(p / 0.5)));
      earthGroup.current.scale.setScalar(s);
      earthGroup.current.position.x = lerp(0, -3.2, ease(clamp(p / 0.6)));
      earthGroup.current.position.y = lerp(0, 0.2, ease(clamp(p / 0.6)));
      // fade out at the end
      const opacity = 1 - ease(clamp((p - 0.7) / 0.3));
      earthGroup.current.visible = opacity > 0.01;
    }

    // Moon: enters from right, grows
    if (moonGroup.current) {
      const enter = ease(clamp((p - 0.25) / 0.55));
      const s = lerp(0.25, 2.2, enter);
      moonGroup.current.scale.setScalar(s);
      moonGroup.current.position.x = lerp(5.5, 1.2, enter);
      moonGroup.current.position.y = lerp(0.4, -0.1, enter);
    }

    // Trajectory: draws between p≈0.25 and p≈0.7
    if (trajRef.current) {
      const drawT = clamp((p - 0.2) / 0.55);
      const total = 120;
      trajRef.current.geometry.setDrawRange(0, Math.floor(drawT * total));
      const mat = trajRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = clamp(drawT * 1.5);
    }

    // Orion: rides the curve between p≈0.35 and p≈0.85
    if (orionGroup.current) {
      const orionT = clamp((p - 0.3) / 0.55);
      const visible = orionT > 0 && orionT < 1;
      orionGroup.current.visible = visible;
      if (visible) {
        const pos = curve.getPoint(orionT);
        const tangent = curve.getTangent(orionT);
        orionGroup.current.position.copy(pos);
        // gentle scale up as it approaches Moon
        const s = lerp(0.35, 0.55, orionT);
        orionGroup.current.scale.setScalar(s);
        // align nose along trajectory
        const lookAt = pos.clone().add(tangent);
        orionGroup.current.lookAt(lookAt);
      }
    }

    // Camera: subtle dolly + parallax
    if (cam.current) {
      cam.current.position.z = lerp(5, 4.2, ease(p));
      cam.current.position.y = lerp(0, 0.3, ease(p));
      cam.current.position.x = lerp(0, 0.4, ease(p));
      cam.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={45} position={[0, 0, 5]} />

      <ambientLight intensity={0.18} />
      <directionalLight position={[6, 4, 6]} intensity={1.4} color="#fff7e6" />
      <pointLight position={[-8, -3, -4]} intensity={0.6} color="#5BC0EB" />

      <Stars radius={120} depth={80} count={6000} factor={3.5} fade speed={0.5} />

      <group ref={earthGroup}>
        <Earth scale={1} />
      </group>

      <group ref={moonGroup}>
        <Moon scale={1} />
      </group>

      {/* Trajectory line */}
      {/* @ts-expect-error r3f line element */}
      <line ref={trajRef}>
        <primitive object={trajGeom} attach="geometry" />
        <lineBasicMaterial color="#5BC0EB" transparent opacity={0} linewidth={2} />
      </line>

      <group ref={orionGroup} visible={false}>
        <Orion />
      </group>
    </>
  );
}

export function ScrollScene({ progressRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Rig progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
