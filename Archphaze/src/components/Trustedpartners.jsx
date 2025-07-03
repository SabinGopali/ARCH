import React from "react";
import { motion } from "framer-motion";

const partners = [
  { title: "Web Design", image: "/logo.webp" },
  { title: "Product Design", image: "/logo.webp" },
  { title: "Branding", image: "/logo.webp" },
  { title: "Print", image: "/logo.webp" },
  { title: "Mobile", image: "/logo.webp" },
  { title: "Illustration", image: "/logo.webp" },
];

export default function Trustedpartners() {
  return (
    <div className="bg-white py-12 px-4 md:px-16 overflow-hidden">
      <h2 className="text-5xl font-extrabold text-center mb-4 text-gray-800 uppercase">
        Trusted <span className="text-red-500">Partners</span>
      </h2>

      <p className="text-center max-w-xl mx-auto text-lg text-gray-600 mb-10">
        Trusted by top teams to create great design.
      </p>

      {/* Inline style for custom animation + pause on hover */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .scroll-wrapper:hover .animate-scroll {
          animation-play-state: paused;
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
          animation-play-state: running;
        }
      `}</style>

      <div className="relative w-full overflow-hidden scroll-wrapper">
        <div className="flex space-x-6 animate-scroll w-max">
          {[...partners, ...partners].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="min-w-[240px] bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-lg font-medium text-gray-700">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
