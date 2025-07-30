import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = ["All", "Headphones", "Health", "Supplements", "Gadgets"];

const products = [
  {
    name: "P9 Wireless Stereo Headphones",
    price: 499,
    category: "Headphones",
    image: "https://via.placeholder.com/150",
    discount: "75% OFF",
  },
  {
    name: "Jaiphal Oil",
    price: 300,
    category: "Health",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Moringa Capsule 90",
    price: 461,
    category: "Supplements",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Lapel Mic Set",
    price: 799,
    category: "Gadgets",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Smart Watch",
    price: 1190,
    category: "Gadgets",
    image: "https://via.placeholder.com/150",
  },
];

export default function Supplierproduct() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-l from-lime-500 via-emerald-500 to-teal-500 py-8 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto rounded-b-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-white font-extrabold text-3xl md:text-4xl leading-snug">
            FAST DELIVERY
          </h1>
          <p className="text-white text-sm md:text-base mt-2 opacity-90">
            472 Followers | 88% Positive Ratings
          </p>
        </div>
        <Link to="/supplierprofileshop">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300">
            Check Store Profile
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 px-6 md:px-12 border-b py-4 text-sm md:text-base font-medium max-w-7xl mx-auto">
        <button className="text-orange-600 border-b-2 border-orange-600 pb-1">Store</button>
        <Link to="/productshowcase">
        <button className="text-gray-500 hover:text-orange-500">Products</button>
        </Link>
      </div>

      {/* Category & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-12 py-5 gap-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center border rounded-full px-3 py-1.5 w-full md:w-80 bg-white shadow-sm">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            className="ml-2 outline-none w-full bg-transparent text-sm"
            placeholder="Search In Store"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-12 pb-12 max-w-7xl mx-auto">
        {filteredProducts.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-2xl p-5 shadow-md border border-gray-100 overflow-hidden group flex flex-col items-center justify-between transition-all duration-300"
          >
            {/* Discount Badge */}
            {item.discount && (
              <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow">
                {item.discount}
              </span>
            )}

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-contain mb-4 drop-shadow-sm"
            />

            {/* Info */}
            <div className="text-center">
              <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                {item.name}
              </h2>
              <p className="text-orange-600 font-bold text-sm mt-1">Rs. {item.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
