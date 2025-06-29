import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import model1 from "/speaker.webp";
import model2 from "/headphone.webp";
import model3 from "/charger.webp";
import model4 from "/vr.webp";
import { useNavigate } from "react-router-dom";

const models = [
  { id: 1, image: model1 },
  { id: 2, image: model2 },
  { id: 3, image: model3 },
  { id: 4, image: model4 },
];

const duplicatedModels = [...models, ...models, ...models];

const customCardStyles = [
  "h-[360px] mt-6 mb-6",
  "h-[440px] mt-6 mb-6",
  "h-[400px] mt-6 mb-6",
  "h-[380px] mt-6 mb-6",
];

export default function Scrollingcards() {
  const controls = useAnimation();
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const [contentWidth, setContentWidth] = useState(0);
  const baseDuration = 30;

  const startScrolling = (fromX = 0) => {
    if (!contentWidth || isNaN(contentWidth)) return;
    const remainingDistance = contentWidth + fromX;
    const speed = contentWidth / baseDuration;
    const adjustedDuration = remainingDistance / speed;

    controls.start({
      x: [fromX, -contentWidth],
      transition: {
        duration: adjustedDuration,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackRef.current) {
        const width = trackRef.current.scrollWidth / 2;
        setContentWidth(width);
        startScrolling(0);
      }
    });
  }, []);

  const stopScrolling = () => controls.stop();
  const resumeScrolling = () => startScrolling(x.get());

  const handleCardClick = (model, index) => {
    const element = itemRefs.current[index];
    const rect = element.getBoundingClientRect();
    const clone = element.cloneNode(true);
    document.body.appendChild(clone);

    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 9999,
      margin: 0,
      pointerEvents: "none",
    });

    import("gsap").then(({ default: gsap }) => {
      gsap.set(clone, {
        transformOrigin: "center center",
        opacity: 1,
        scale: 1,
      });

      gsap.to(clone, {
        duration: 0.7,
        scale: 1.1,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(clone);
          navigate("/productdetail", {
            state: {
              item: {
                title: `Model ${model.id}`,
                image: model.image,
              },
              rect,
            },
          });
        },
      });
    });
  };

  return (
    <div className="w-full overflow-x-hidden bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            ✨ Top <span className=" text-red-500">Featured</span> Products
          </h2>
          <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-xl mx-auto">
            Explore our best picks loved by our tech-savvy community. Tap a product to learn more.
          </p>
        </div>
      </div>

      {/* Background stripe */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-100/40 via-purple-100/40 to-blue-100/40 blur-lg rounded-xl z-0" />

        <div
          className="w-full overflow-x-hidden relative z-10"
          onMouseEnter={stopScrolling}
          onMouseLeave={resumeScrolling}
        >
          <motion.div
            ref={trackRef}
            animate={controls}
            style={{ x }}
            className="flex gap-6 w-max items-center px-4"
          >
            {duplicatedModels.map((model, index) => (
              <div
                key={`${model.id}-${index}`}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => handleCardClick(model, index)}
                className={`
                  relative backdrop-blur-xl bg-white/80 border border-gray-200 
                  hover:shadow-2xl hover:scale-105 transition-all duration-300 
                  rounded-3xl p-4 cursor-pointer flex-shrink-0 
                  w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]
                  ${customCardStyles[index % customCardStyles.length]} 
                `}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" />
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={model.image}
                    alt={`Model ${model.id}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
