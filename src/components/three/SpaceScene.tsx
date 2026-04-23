import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

// ---------- Procedural Earth ----------
function Earth({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.07;
  });

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
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
          vec3 lightDir = normalize(vec3(1.0, 0.6, 0.8));
          float lambert = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.12;
          col *= (lambert + ambient);
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
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#5BC0EB" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ---------- Procedural Moon (high-detail, photoreal-ish) ----------
function Moon({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });

  const moonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vViewDir;

        // ---- Hash + value noise ----
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
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
        float fbm(vec3 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.07 + 11.3; a *= 0.5; }
          return v;
        }

        // ---- Voronoi for crater placement (returns distance + cell id) ----
        vec2 voronoi(vec3 p) {
          vec3 b = floor(p);
          vec3 f = fract(p);
          float minD = 1e9;
          float id = 0.0;
          for (int z=-1; z<=1; z++)
          for (int y=-1; y<=1; y++)
          for (int x=-1; x<=1; x++) {
            vec3 g = vec3(float(x), float(y), float(z));
            vec3 o = vec3(hash(b+g), hash(b+g+19.1), hash(b+g+47.7));
            float d = length(g + o - f);
            if (d < minD) { minD = d; id = hash(b+g+3.7); }
          }
          return vec2(minD, id);
        }

        // ---- Crater height field: layered voronoi at a few scales ----
        float craterField(vec3 p) {
          float h = 0.0;
          // Big basins
          vec2 v1 = voronoi(p * 1.6);
          // Bowl shape: deep center, raised rim, fade outside
          float r1 = v1.x;
          float bowl1 = -smoothstep(0.0, 0.18, r1) * (1.0 - smoothstep(0.18, 0.30, r1));
          float rim1  = smoothstep(0.18, 0.26, r1) * (1.0 - smoothstep(0.26, 0.42, r1));
          h += (bowl1 * 0.55 + rim1 * 0.35) * step(0.4, v1.y); // only some cells are craters

          // Medium craters
          vec2 v2 = voronoi(p * 4.0 + 5.2);
          float r2 = v2.x;
          float bowl2 = -smoothstep(0.0, 0.14, r2) * (1.0 - smoothstep(0.14, 0.24, r2));
          float rim2  = smoothstep(0.14, 0.20, r2) * (1.0 - smoothstep(0.20, 0.32, r2));
          h += (bowl2 * 0.4 + rim2 * 0.28) * step(0.55, v2.y);

          // Small pockmarks
          vec2 v3 = voronoi(p * 10.0 + 17.0);
          float r3 = v3.x;
          float bowl3 = -smoothstep(0.0, 0.10, r3) * (1.0 - smoothstep(0.10, 0.18, r3));
          h += bowl3 * 0.2 * step(0.5, v3.y);

          // Tiny pockmarks for surface texture
          vec2 v4 = voronoi(p * 24.0 + 31.5);
          float r4 = v4.x;
          h += -smoothstep(0.0, 0.06, r4) * (1.0 - smoothstep(0.06, 0.12, r4)) * 0.08
               * step(0.55, v4.y);

          return h;
        }

        float heightAt(vec3 p) {
          // Combine fine fbm regolith + crater field
          float regolith = (fbm(p * 6.0) - 0.5) * 0.06;
          float micro    = (fbm(p * 18.0) - 0.5) * 0.025;
          float craters  = craterField(p);
          return regolith + micro + craters;
        }

        // Mare (dark basaltic plains) mask — large smooth low-frequency blobs
        float mareMask(vec3 p) {
          float m = fbm(p * 1.1 + 9.0);
          return smoothstep(0.55, 0.72, m);
        }

        void main() {
          // ---- Bump-mapped normal via finite differences in object space ----
          float e = 0.0025;
          vec3 px = normalize(vPos);
          float h  = heightAt(px);
          float hx = heightAt(normalize(px + vec3(e, 0.0, 0.0)));
          float hy = heightAt(normalize(px + vec3(0.0, e, 0.0)));
          float hz = heightAt(normalize(px + vec3(0.0, 0.0, e)));
          vec3 grad = vec3(hx - h, hy - h, hz - h) / e;
          // Project gradient onto tangent plane
          vec3 tangentGrad = grad - dot(grad, px) * px;
          // Perturb the world-space normal
          vec3 N = normalize(vNormal - normalMatrix * tangentGrad * 1.6);

          // ---- Albedo ----
          float mare = mareMask(px);
          float regolith = fbm(px * 8.0);
          // Highlands: warm bright grey; mare: cool dark basalt
          vec3 highlandsLight = vec3(0.78, 0.74, 0.68);
          vec3 highlandsDark  = vec3(0.55, 0.52, 0.48);
          vec3 highlands = mix(highlandsDark, highlandsLight, regolith);
          vec3 mareDark  = vec3(0.18, 0.18, 0.20);
          vec3 mareLight = vec3(0.30, 0.29, 0.30);
          vec3 mareColor = mix(mareDark, mareLight, regolith);
          vec3 albedo = mix(highlands, mareColor, mare);

          // Crater ejecta: brighten near steep rims
          float rimBrightness = clamp(length(tangentGrad) * 0.6, 0.0, 0.4);
          albedo += rimBrightness * 0.18;

          // Subtle warm/cool variation
          albedo *= 0.92 + 0.16 * fbm(px * 3.0);

          // ---- Lighting (key sun + soft fill) ----
          vec3 lightDir = normalize(vec3(0.85, 0.45, 0.55));
          float NdotL = dot(N, lightDir);
          // Sharp terminator with tiny softening for realism
          float lambert = smoothstep(-0.05, 0.18, NdotL);

          // Specular: regolith is rough — keep tiny
          vec3 H = normalize(lightDir + vViewDir);
          float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.05;

          // Fill: cool earthshine on the night side, very subtle
          float backFill = smoothstep(0.0, -0.6, NdotL) * 0.06;
          vec3 fill = vec3(0.22, 0.30, 0.45) * backFill;

          // Ambient: extremely low (space)
          float ambient = 0.025;

          vec3 col = albedo * (lambert + ambient) + fill + vec3(spec);

          // Tone & contrast
          col = pow(col, vec3(0.95));
          col = clamp(col, 0.0, 1.0);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <group scale={scale}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 192, 192]} />
        <primitive object={moonMaterial} attach="material" />
      </mesh>
      {/* Faint outer glow so it pops off the starfield */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#cfd2d8" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ---------- Orion ----------
function Orion() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.4;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.6, 0.7, 32]} />
          <meshStandardMaterial color="#e8e8ec" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.7, 32]} />
          <meshStandardMaterial color="#0B3D91" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 0.25, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.95, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 0.7, 0.4]} />
            <meshStandardMaterial color="#1a3b6b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        <mesh position={[0, -0.7, 0]}>
          <ringGeometry args={[0.18, 0.32, 32]} />
          <meshBasicMaterial color="#FC3D21" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

export { Earth, Moon, Orion };

// ---------- Single-variant (used by sub-pages) ----------
type Props = { variant: "earth" | "spacecraft" | "moon" };

function SimpleScene({ variant }: Props) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#fff7e6" />
      <pointLight position={[-5, -2, -3]} intensity={0.5} color="#5BC0EB" />
      <Stars radius={80} depth={60} count={4000} factor={3} fade speed={0.6} />
      {variant === "earth" && <Earth scale={2.2} />}
      {variant === "spacecraft" && <Orion />}
      {variant === "moon" && <Moon scale={1.4} />}
    </>
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
        <SimpleScene variant={variant} />
      </Suspense>
    </Canvas>
  );
}
