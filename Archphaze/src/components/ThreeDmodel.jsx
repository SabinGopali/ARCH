// components/ThreeDModel.jsx
import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, Center } from '@react-three/drei';

// Optional: preload a default model
useGLTF.preload('/models/your-default-model.glb');

function Model({ path }) {
  const { scene } = useGLTF(path);
  return (
    <Center>
      <primitive object={scene} rotation={[-0.2, 0, 0]} />
    </Center>
  );
}

export default function ThreeDModel({ modelPath }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < 768);
    }, 150);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cameraSettings = useMemo(() => ({ position: [0, 1.2, 6], fov: 45 }), []);
  const canvasStyle = useMemo(() => ({ width: '100%', height: '100%', background: 'transparent' }), []);

  return (
    <div
      className="w-full h-[60vh] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]"
      style={{
        pointerEvents: isMobile ? 'none' : 'auto',
        maxWidth: '730px',
        maxHeight: '600px',
      }}
    >
      <Canvas
        camera={cameraSettings}
        style={canvasStyle}
        shadows={false}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Bounds fit margin={1}>
            <Model path={modelPath} />
          </Bounds>
        </Suspense>
        {!isMobile && (
          <OrbitControls
            enablePan={true}
            enableZoom={false}
            enableRotate={true}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        )}
      </Canvas>
    </div>
  );
}
