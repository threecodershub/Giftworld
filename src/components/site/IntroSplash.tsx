import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { ProductMesh } from "@/components/three/ProductMesh";
import { products } from "@/data/products";
import defaultLogo from "@/assets/logo.png";

interface Props {
  isClosing: boolean;
  onSkip: () => void;
}

const bracelet = products.find((p) => p.category === "bracelets")!;
const pen = products.find((p) => p.category === "pens")!;
const keychain = products.find((p) => p.category === "keychains")!;
const uploadedLogoPath = "/@fs/C:/Users/Siva%20prakash%20S/.cursor/projects/c-ace-New-folder-glimmer-gifts-main/assets/c__Users_Siva_prakash_S_AppData_Roaming_Cursor_User_workspaceStorage_f593b2d4f917430a5c01d50b870ffdf4_images_ChatGPT_Image_Apr_28__2026__09_31_09_AM-73fe768e-4575-4d94-a11c-70f2931a9a34.png";

export const IntroSplash = ({ isClosing, onSkip }: Props) => {
  return (
    <div className={`intro-splash ${isClosing ? "intro-splash--closing" : ""}`}>
      <div className="intro-splash__glow intro-splash__glow--one" />
      <div className="intro-splash__glow intro-splash__glow--two" />

      <div className="intro-splash__canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 6], fov: 42 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 4, 2]} intensity={1.25} color="#ffeccf" />
          <directionalLight position={[-3, 2, -2]} intensity={0.65} color="#d8c1ff" />
          <Suspense fallback={null}>
            <group position={[-2, 0.2, 0.1]} scale={0.9}>
              <ProductMesh category="bracelets" colors={bracelet.colors} image={bracelet.image} spin scale={1.05} />
            </group>
            <group position={[0, -0.35, 0.35]} scale={1.05}>
              <ProductMesh category="pens" colors={pen.colors} image={pen.image} spin />
            </group>
            <group position={[2.2, 0.35, -0.15]} scale={0.85}>
              <ProductMesh category="keychains" colors={keychain.colors} image={keychain.image} spin />
            </group>
            <Float speed={1.3} rotationIntensity={0.22} floatIntensity={0.35}>
              <mesh position={[-3, 1.2, -1]}>
                <sphereGeometry args={[0.1, 30, 30]} />
                <meshPhysicalMaterial color="#f8deef" clearcoat={1} roughness={0.2} />
              </mesh>
            </Float>
            <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.32}>
              <mesh position={[3, -0.9, -1]}>
                <sphereGeometry args={[0.08, 30, 30]} />
                <meshPhysicalMaterial color="#dbc0ff" clearcoat={1} roughness={0.2} />
              </mesh>
            </Float>
            <ContactShadows position={[0, -1.6, 0]} opacity={0.34} scale={9.5} blur={2.8} far={3} color="#8f73cc" />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <div className="intro-splash__content">
        <p className="intro-splash__eyebrow">Swapn's Gift World</p>
        <h1 className="intro-splash__title">
          Gifts in motion,
          <span> crafted in 3D</span>
        </h1>
        <p className="intro-splash__subtitle">Bracelets, pens and keychains unveiled with cinematic detail.</p>
      </div>

      <div className="intro-splash__logo-stage">
        <img
          src={uploadedLogoPath}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultLogo;
          }}
          alt="Swapn's Gift World logo"
          className="intro-splash__brand-logo"
        />
        <p className="intro-splash__logo-tagline">Handpicked keepsakes with premium 3D experience</p>
      </div>

      <button type="button" onClick={onSkip} className="intro-splash__skip" aria-label="Skip intro">
        Skip intro
      </button>
    </div>
  );
};
