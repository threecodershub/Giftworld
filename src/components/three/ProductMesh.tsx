import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Category } from "@/data/products";

interface Props {
  category: Category;
  colors: string[];
  image: string;
  spin?: boolean;
  scale?: number;
}

export const ProductMesh = ({ category, colors, image, spin = true, scale = 1 }: Props) => {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const fallback = new THREE.DataTexture(new Uint8Array([245, 240, 232, 255]), 1, 1, THREE.RGBAFormat);
    fallback.needsUpdate = true;
    fallback.colorSpace = THREE.SRGBColorSpace;
    fallback.wrapS = THREE.RepeatWrapping;
    fallback.wrapT = THREE.RepeatWrapping;

    const loader = new THREE.TextureLoader();
    const loaded = loader.load(
      image,
      () => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 8;
        loaded.wrapS = THREE.RepeatWrapping;
        loaded.wrapT = THREE.RepeatWrapping;
      },
      undefined,
      () => {}
    );
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 8;
    return loaded;
  }, [image]);

  const seed = useMemo(() => {
    return image.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 7;
  }, [image]);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (spin) group.current.rotation.y += dt * 0.42;
    group.current.rotation.x = Math.sin(performance.now() * 0.0005 + seed * 0.4) * 0.03;
    group.current.rotation.z = Math.sin(performance.now() * 0.0004 + seed * 0.3) * 0.02;
  });

  const base = colors[0] || "#d9dce0";
  const accent = colors[1] || base;
  const detail = colors[2] || "#ffffff";

  const renderProductByCategory = () => {
    if (category === "bracelets") {
      return (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.82, 0.14 + seed * 0.005, 28, 120]} />
            <meshPhysicalMaterial color={base} metalness={0.88} roughness={0.22} clearcoat={1} />
          </mesh>
          <mesh position={[0, -0.05, 0.72]}>
            <circleGeometry args={[0.28, 42]} />
            <meshStandardMaterial map={texture} metalness={0.1} roughness={0.82} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0.3, 0.2]} position={[0, -0.06, 0]}>
            <torusGeometry args={[0.82, 0.03, 20, 90]} />
            <meshStandardMaterial color={accent} metalness={0.68} roughness={0.35} />
          </mesh>
        </group>
      );
    }

    if (category === "pens") {
      return (
        <group rotation={[0, 0, Math.PI / 2.4]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 2.35, 56]} />
            <meshPhysicalMaterial map={texture} color={base} metalness={0.4} roughness={0.3} clearcoat={1} />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <coneGeometry args={[0.1, 0.22, 40]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.17, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.36, 28]} />
            <meshStandardMaterial color={detail} metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0.11, 0.2, 0]}>
            <boxGeometry args={[0.06, 0.7, 0.06]} />
            <meshStandardMaterial color={detail} metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      );
    }

    return (
      <group>
        <mesh>
          <boxGeometry args={[1.55 + seed * 0.04, 0.82, 0.14]} />
          <meshPhysicalMaterial color={base} metalness={0.58} roughness={0.36} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.082]}>
          <boxGeometry args={[1.22, 0.54, 0.02]} />
          <meshStandardMaterial map={texture} color={detail} metalness={0.1} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0, -0.082]}>
          <boxGeometry args={[1.22, 0.54, 0.02]} />
          <meshStandardMaterial map={texture} color={detail} metalness={0.1} roughness={0.55} />
        </mesh>
        <mesh position={[0.93, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.055, 20, 80]} />
          <meshStandardMaterial color={accent} metalness={0.82} roughness={0.2} />
        </mesh>
      </group>
    );
  };

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
      <group ref={group} scale={scale}>
        {renderProductByCategory()}
        <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 1.25, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
};
