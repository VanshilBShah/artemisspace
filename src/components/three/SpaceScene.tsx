import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

// Procedural Earth with subtle atmospheric rim glow
function Earth({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.07;
  });

  // Procedural earth-like material via shader noise approximation using gradient texture
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPos;

        // Simple hash noise
        float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
        float noise(vec3 p) {
          vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
          float n000 = hash(i);
          float n100 = hash(i+vec3(1,0,0));
          float n010 = hash(i+vec3(0,1,0));
          float n110 = hash(i+vec3(1,1,0));
          float n001 = hash(i+vec3(0,0,1));
          float n101 = hash(i+vec3(1,0,1));
          float n011 = hash(i+vec3(0,1,1));
          float n111 = hash(i+vec3(1,1,1));
          return mix(
            mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
            mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y),
            f.z
          );
        }

        void main() {
          float n = noise(vPos * 2.0) * 0.6 + noise(vPos * 6.0) * 0.4;
          vec3 ocean = vec3(0.02, 0.18, 0.42);
          vec3 land = vec3(0.16, 0.42, 0.22);
          vec3 ice = vec3(0.95, 0.97, 1.0);
          vec3 col = mix(ocean, land, smoothstep(0.45, 0.55, n));
          float pole = smoothstep(0.78, 0.95, abs(vPos.y));
          col = mix(col, ice, pole);

          // Lighting
          vec3 lightDir = normalize(vec3(1.0, 0.6, 0.8));
          float lambert = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.12;
          col *= (lambert + ambient);

          // Atmospheric rim
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          rim = pow(rim, 2.5);
          col += vec3(0.3, 0.55, 0.95) * rim * 0.7;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <group scale={scale}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 96, 96]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>
      <mesh ref={cloudRef} scale={1.012}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#5BC0EB" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Moon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.55, 64, 64]} />
      <meshStandardMaterial color="#c8c4be" roughness={1} metalness={0} />
    </mesh>
  );
}

// Stylized Orion capsule
function Orion({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.4;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group} position={position} scale={0.6}>
        {/* Crew module (cone) */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.6, 0.7, 32]} />
          <meshStandardMaterial color="#e8e8ec" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Service module */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.7, 32]} />
          <meshStandardMaterial color="#0B3D91" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Engine bell */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 0.25, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Solar arrays */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.95, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.05, 0.7, 0.4]} />
              <meshStandardMaterial color="#1a3b6b" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Glow ring */}
        <mesh position={[0, -0.7, 0]}>
          <ringGeometry args={[0.18, 0.32, 32]} />
          <meshBasicMaterial color="#FC3D21" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

type Props = { variant: "earth" | "trajectory" | "spacecraft" | "moon" };

function Scene({ variant }: Props) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#fff7e6" />
      <pointLight position={[-5, -2, -3]} intensity={0.5} color="#5BC0EB" />

      <Stars radius={80} depth={60} count={4000} factor={3} fade speed={0.6} />

      {variant === "earth" && <Earth scale={2.2} />}

      {variant === "trajectory" && (
        <>
          <Earth scale={1} />
          <Moon position={[5, 1.5, -1]} />
          <TrajectoryArc />
        </>
      )}

      {variant === "spacecraft" && <Orion position={[0, 0, 0]} />}

      {variant === "moon" && <Moon position={[0, 0, 0]} />}
    </>
  );
}

function TrajectoryArc() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(5, 1.5, -1);
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const p = new THREE.Vector3().lerpVectors(start, end, t);
      // arc upward
      p.y += Math.sin(t * Math.PI) * 1.2;
      pts.push(p);
    }
    return pts;
  }, []);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#5BC0EB" transparent opacity={0.85} />
    </line>
  );
}

export function SpaceScene({ variant }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, variant === "spacecraft" ? 3 : 4.5], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene variant={variant} />
      </Suspense>
    </Canvas>
  );
}
