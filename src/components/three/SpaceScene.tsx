import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, Float, Billboard } from "@react-three/drei";
import * as THREE from "three";

// ---------- Real-photo Earth (billboarded disc with atmospheric glow) ----------
function Earth({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/earth.avif");

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  // Custom shader: render the photo as a circular disc with darkened edges removed,
  // add a cyan atmospheric rim that fades outward.
  const discMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTex: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTex;
        void main() {
          // Distance from center for circular masking
          vec2 c = vUv - 0.5;
          float r = length(c) * 2.0;
          if (r > 1.0) discard;

          // Sample photo
          vec4 tex = texture2D(uTex, vUv);

          // Boost saturation/contrast slightly so it pops on dark space
          vec3 col = tex.rgb;
          float luma = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(vec3(luma), col, 1.15);
          col *= 1.05;

          // Soft alpha falloff at the very edge for clean anti-aliasing
          float alpha = smoothstep(1.0, 0.985, r);

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
  }, [texture]);

  // Atmospheric glow ring — sits behind the photo
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv - 0.5;
          float r = length(c) * 2.0;
          // Bright thin rim right at the planet edge, fades outward
          float rim = smoothstep(0.78, 0.92, r) * (1.0 - smoothstep(0.92, 1.15, r));
          float halo = (1.0 - smoothstep(0.92, 1.4, r)) * 0.35;
          float a = clamp(rim * 1.2 + halo, 0.0, 1.0);
          vec3 col = mix(vec3(0.35, 0.65, 1.0), vec3(0.7, 0.85, 1.0), rim);
          gl_FragColor = vec4(col, a);
        }
      `,
    });
  }, []);

  return (
    <group ref={groupRef} scale={scale}>
      <Billboard follow>
        {/* Atmospheric glow (slightly larger, behind) */}
        <mesh position={[0, 0, -0.01]} scale={2.6}>
          <planeGeometry args={[1, 1]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
        {/* Earth photo disc */}
        <mesh scale={2}>
          <planeGeometry args={[1, 1]} />
          <primitive object={discMaterial} attach="material" />
        </mesh>
      </Billboard>
    </group>
  );
}

// ---------- Real-photo Moon (billboarded disc with subtle halo) ----------
function Moon({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/moon.webp");

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  const discMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: texture } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTex;
        void main() {
          vec2 c = vUv - 0.5;
          float r = length(c) * 2.0;
          if (r > 1.0) discard;

          vec4 tex = texture2D(uTex, vUv);
          vec3 col = tex.rgb;

          // Slight contrast lift so craters read clearly
          col = (col - 0.5) * 1.08 + 0.5;
          // Subtle warm tint to feel cinematic
          col *= vec3(1.02, 1.0, 0.98);

          // Anti-aliased circular mask
          float alpha = smoothstep(1.0, 0.985, r);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
  }, [texture]);

  // Faint cool halo around the moon — barely visible, pure cinematic touch
  const haloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv - 0.5;
          float r = length(c) * 2.0;
          float halo = (1.0 - smoothstep(0.78, 1.25, r)) * 0.18;
          float rim = smoothstep(0.74, 0.82, r) * (1.0 - smoothstep(0.82, 0.95, r)) * 0.25;
          float a = clamp(halo + rim, 0.0, 1.0);
          gl_FragColor = vec4(vec3(0.85, 0.88, 0.95), a);
        }
      `,
    });
  }, []);

  return (
    <group ref={groupRef} scale={scale}>
      <Billboard follow>
        <mesh position={[0, 0, -0.01]} scale={2.5}>
          <planeGeometry args={[1, 1]} />
          <primitive object={haloMaterial} attach="material" />
        </mesh>
        <mesh scale={2}>
          <planeGeometry args={[1, 1]} />
          <primitive object={discMaterial} attach="material" />
        </mesh>
      </Billboard>
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
