import React from "react";
import { motion } from "framer-motion";
import model1 from "/speaker.webp";
import { Link } from "react-router-dom";

const bibs = [
  { image: model1, price: "14.70 CHF" },
  { image: model1, price: "14.70 CHF" },
  { image: model1, price: "14.70 CHF" },
  { image: model1, price: "14.70 CHF" },
];

export default function Speakercards() {
  return (
    <>
      {bibs.map((item, index) => (
        <motion.div
          whileHover={{ scale: 1.02 }}
          key={index}
          className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-200 overflow-hidden group flex flex-col items-center justify-between transition-all duration-300"
        >
          {/* Product Image */}
          <div className="relative z-10 mb-4">
            <img
              src={item.image}
              alt="Product"
              className="mx-auto w-32 h-32 object-contain drop-shadow-sm"
            />
          </div>

          {/* Product Info */}
          <div className="text-center z-10">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {item.price}
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              Silicone Bib
            </h3>
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-2xl z-20"
          >
            <Link to="/productdetail/speaker1">
              <button className="px-5 py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 shadow-md">
                View Details
              </button>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
