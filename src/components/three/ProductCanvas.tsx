import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { ProductMesh } from "./ProductMesh";
import { Category } from "@/data/products";

interface Props {
  category: Category;
  colors: string[];
  image: string;
  interactive?: boolean;
  className?: string;
  scale?: number;
  /** When true the canvas lets the user drag without interactive=true (card 360 mode) */
  draggable?: boolean;
}

export const ProductCanvas = ({
  category,
  colors,
  image,
  interactive = false,
  draggable = false,
  className,
  scale = 1,
}: Props) => {
  const enableControls = interactive || draggable;

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#fde6f0" />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#c9a0dc" />
        <Suspense fallback={null}>
          <ProductMesh
            category={category}
            colors={colors}
            image={image}
            spin={!enableControls}
            scale={scale}
          />
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.35}
            scale={6}
            blur={2.6}
            far={3}
            color="#9b72cf"
          />
          <Environment preset="studio" />
        </Suspense>
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={interactive}
            minDistance={2.5}
            maxDistance={7}
            autoRotate={false}
            // on card draggable mode only allow y-axis rotate
            maxPolarAngle={interactive ? Math.PI : Math.PI / 2 + 0.3}
            minPolarAngle={interactive ? 0 : Math.PI / 2 - 0.3}
          />
        )}
      </Canvas>
    </div>
  );
};
