import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BibCards from "./Bibcards";
import Platecards from "./Platecards";
// Import your other card components as needed
// import BowlCards from "./BowlCards";
// import SnackCupCards from "./SnackCupCards";
// import GlassCards from "./GlassCards";
// import CoveredCards from "./CoveredCards";

const categories = ["Bib", "Plate", "Bowl", "Snack cup", "Glass", "Covered"];

export default function Category() {
  const [selected, setSelected] = useState("Bib");

  const renderCards = () => {
    switch (selected) {
      case "Plate":
        return <Platecards />;
      // case "Bowl":
      //   return <BowlCards />;
      // case "Snack cup":
      //   return <SnackCupCards />;
      // case "Glass":
      //   return <GlassCards />;
      // case "Covered":
      //   return <CoveredCards />;
      default:
        return <BibCards />;
    }
  };

  return (
    <div className="bg-white min-h-screen px-4 sm:px-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-800 tracking-tight uppercase">
        Discover by <span className="text-red-500">Category</span>
      </h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-12">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelected(cat)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border backdrop-blur-md ${
              selected === cat
                ? "bg-black text-white shadow-lg shadow-red-200 border-transparent"
                : "bg-white/50 text-gray-700 border-gray-300 hover:text-black hover:border-black"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {renderCards()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-14">
        <button className="px-6 py-3 bg-white text-black rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300 font-semibold tracking-wide text-sm">
          See all our products
        </button>
      </div>
    </div>
  );
}
