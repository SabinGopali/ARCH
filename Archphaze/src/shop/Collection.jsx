import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const images = [
  "/headphone.webp",
  "/speaker.webp",
  "/vr.webp",
  "/charger.webp",
  "/headphone.webp",
  "/speaker.webp",
  "/vr.webp",
  "/charger.webp",
];

const gridItems = images.map((img, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  image: img,
}));

export default function Collection() {
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const handleClick = (index) => {
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
      zIndex: 10000,
      margin: 0,
    });

    gsap.to(clone, {
      duration: 0.6,
      scale: 1.05,
      ease: "power3.inOut",
      onComplete: () => {
        document.body.removeChild(clone);
        navigate(`/productdetail/${gridItems[index].id}`, {
          state: { item: gridItems[index], rect },
        });
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-80px] left-[-80px] w-[200px] h-[200px] bg-pink-200 rounded-full opacity-30 blur-2xl z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full opacity-30 blur-3xl z-0"></div>

      {/* Page Heading */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl font-extrabold uppercase">
          New <span className="text-red-500">Collections</span>
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Explore the latest tech products with stunning design and power.
        </p>
        <div className="mx-auto mt-4 w-24 h-1 bg-red-500 rounded-full"></div>
      </div>

      {/* Card Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {gridItems.map(({ id, title, image }, index) => (
          <div
            key={id}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => handleClick(index)}
            className="
              bg-gradient-to-tr from-white via-gray-50 to-white
              rounded-xl
              shadow-lg
              hover:shadow-2xl
              cursor-pointer
              overflow-hidden
              transition
              duration-300
              transform
              hover:scale-105
              relative
            "
          >
            {/* Subtle shine overlay */}
            <div className="pointer-events-none absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-80 transition-opacity duration-500 transform -skew-x-12"></div>

            <div className="h-[300px] w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-red-100 via-pink-50 to-white">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
