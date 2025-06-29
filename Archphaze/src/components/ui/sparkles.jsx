import React, { useEffect, useState, useId } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "../../utils/cn";
import { motion, useAnimation } from "framer-motion"; // ✅ Correct here

export const SparklesCore = (props) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;

  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const controls = useAnimation();
  const generatedId = useId();

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  };

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: { value: background || "#0d47a1" },
            },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            particles: {
              number: {
                value: particleDensity || 120,
                density: { enable: true, width: 400, height: 400 },
              },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
              move: {
                enable: true,
                speed: { min: 0.1, max: 1 },
              },
              color: { value: particleColor || "#ffffff" },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: { enable: true, speed: speed || 4 },
              },
              shape: { type: "circle" },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};