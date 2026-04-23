import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

// ---------- Photoreal Earth (real sphere with day/normal/specular + clouds + atmosphere) ----------
function Earth({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth_2k.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_specular.jpg",
    "/textures/earth_clouds.png",
  ]);

  useMemo(() => {
    [colorMap, cloudsMap].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
    [normalMap, specularMap].forEach((t) => {
      t.anisotropy = 8;
    });
  }, [colorMap, normalMap, specularMap, cloudsMap]);

  // Atmospheric glow shader (Fresnel rim)
  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          uColor: { value: new THREE.Color("#5BC0EB") },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform vec3 uColor;
          void main() {
            vec3 viewDir = normalize(-vPos);
            float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
            float a = clamp(fres, 0.0, 1.0) * 0.9;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.04;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.055;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Earth surface */}
      <mesh ref={earthRef} rotation={[0, 0, THREE.MathUtils.degToRad(-23.5)]}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color("#3a5a80")}
          shininess={18}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} rotation={[0, 0, THREE.MathUtils.degToRad(-23.5)]}>
        <sphereGeometry args={[1.012, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}

// ---------- Photoreal Moon (real sphere with NASA color map + bump + subtle halo) ----------
function Moon({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const colorMap = useLoader(THREE.TextureLoader, "/textures/moon_2k.jpg");

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = 8;
  }, [colorMap]);

  // Faint cool halo (Fresnel)
  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: { uColor: { value: new THREE.Color("#aab8d4") } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform vec3 uColor;
          void main() {
            vec3 viewDir = normalize(-vPos);
            float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
            float a = clamp(fres, 0.0, 1.0) * 0.35;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    if (moonRef.current) moonRef.current.rotation.y += dt * 0.02;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={colorMap}
          bumpScale={0.04}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Subtle halo */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1, 48, 48]} />
        <primitive object={haloMat} attach="material" />
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
      <directionalLight position={[5, 3, 5]} intensity={1.6} color="#fff7e6" />
      <pointLight position={[-5, -2, -3]} intensity={0.4} color="#5BC0EB" />
      <Stars radius={80} depth={60} count={4000} factor={3} fade speed={0.6} />
      {variant === "earth" && <Earth scale={1.6} />}
      {variant === "spacecraft" && <Orion />}
      {variant === "moon" && <Moon scale={1.6} />}
    </>
  );
}

export function SpaceScene({ variant }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, variant === "spacecraft" ? 3 : 4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SimpleScene variant={variant} />
      </Suspense>
    </Canvas>
  );
}
