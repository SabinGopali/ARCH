import React from "react";
import { motion } from "framer-motion";
import model1 from "/speaker.webp";
import { Link } from "react-router-dom";

const bibs = [
  { color: "Silver", hex: "from-gray-200 to-gray-400", image: model1, price: "14.70 CHF" },
  { color: "Graphite", hex: "from-gray-200 to-gray-400", image: model1, price: "14.70 CHF" },
  { color: "Charcoal", hex: "from-gray-200 to-gray-400", image: model1, price: "14.70 CHF" },
  { color: "Slate", hex: "from-gray-200 to-gray-400", image: model1, price: "14.70 CHF" },
];

export default function Bibcards() {
  return (
    <>
      {bibs.map((item, index) => (
        <motion.div
          whileHover={{ scale: 1.015 }}
          key={index}
          className={`relative bg-gradient-to-br ${item.hex} rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group`}
        >

          {/* Product Image */}
          <div className="relative z-10">
            <img
              src={item.image}
              alt={`Tech Bib in ${item.color}`}
              className="mx-auto w-28 h-28 object-contain mb-5 drop-shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="z-10 relative">
            <p className="text-sm font-semibold text-gray-700 mb-1 tracking-wide">
              {item.price}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-4">
              Silicone Bib – {item.color}
            </h3>

           
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-20 rounded-2xl"
          >
            <Link to="/productdetail">
            <button className="px-5 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 shadow-lg">
              View Details
            </button>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
