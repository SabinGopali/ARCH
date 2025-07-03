import React from "react";
import { motion } from "framer-motion";
import model1 from "/logo.webp";

const bibs = [
  { color: "Pink", hex: "bg-pink-100", image: model1, price: "14.70 CHF" },
  { color: "Green", hex: "bg-green-100", image: model1, price: "14.70 CHF" },
  { color: "Beige", hex: "bg-orange-100", image: model1, price: "14.70 CHF" },
  { color: "Blue", hex: "bg-blue-100", image: model1, price: "14.70 CHF" },
];

export default function Platecards() {
  return (
    <>
      {bibs.map((item, index) => (
        <motion.div
          whileHover={{ scale: 1.03 }}
          key={index}
          className={`rounded-3xl p-6 ${item.hex} relative shadow-md transition-all duration-300`}
        >
          <img
            src={item.image}
            alt={`Bib in ${item.color}`}
            className="mx-auto w-24 h-24 object-contain mb-4"
          />
          <p className="text-sm font-semibold text-gray-700 mb-2">{item.price}</p>
          <h3 className="text-lg font-semibold mb-1">Bavoir en silicone</h3>
          <button className="mt-4 bg-pink-100 text-pink-600 px-4 py-2 rounded-xl font-medium text-sm shadow">
            Add to Cart
          </button>
        </motion.div>
      ))}
    </>
  );
}
