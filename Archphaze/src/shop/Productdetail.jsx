import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import logo from "/logo.webp";
import arch from "/archphaze.webp";

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M");
  const ratingRef = useRef(null);
  const isInView = useInView(ratingRef, { once: true, margin: "-100px" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-gray-800">
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <img
            src={logo}
            alt="Hoodie"
            className="rounded-2xl shadow-md w-full object-cover"
          />

          <div className="flex gap-4">
            {[1, 2, 3].map((_, idx) => (
              <img
                key={idx}
                src={arch}
                alt="Thumbnail"
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="md:sticky md:top-24 h-fit self-start"
        >
          <div className="min-h-screen flex flex-col justify-between space-y-10">
            {/* Product Info */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold">Loose Fit Hoodie</h2>
              <p className="text-lg sm:text-xl text-gray-600">$24.99</p>
              <p className="text-sm text-green-600">
                Order in 03:20:36 to get next day delivery
              </p>
            </div>

            {/* Size Selection */}
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition-all">
              <AiOutlineShoppingCart size={20} /> Add to Cart
            </button>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description & Fit</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Loose fit sweatshirt hoodie in medium-weight cotton-blend fabric with a
                generous, but not oversized silhouette. Jersey-lined, drawstring hood,
                dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at
                cuffs and hem. Soft, brushed inside.
              </p>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-sm">
              <div>
                <p className="font-semibold">Discount</p>
                <p>Upto 50%</p>
              </div>
              <div>
                <p className="font-semibold">Package</p>
                <p>Regular Package</p>
              </div>
              <div>
                <p className="font-semibold">Delivery</p>
                <p>3-4 Working Days</p>
                <p className="text-gray-500 text-xs">10 - 12 October 2024</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating & Review Section */}
      <div ref={ratingRef} className="mt-20">
        {isInView && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Rating & Reviews</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="text-4xl sm:text-5xl font-bold">
                  4.5 <span className="text-lg text-gray-600">/ 5</span>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-yellow-400 rounded w-1/2"></div>
                      </div>
                      <span className="w-6 text-sm">{star}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Card */}
            <div className="p-5 bg-gray-50 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    className="w-10 h-10 rounded-full"
                    alt="user"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Alex Mathio</p>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar key={idx} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">13 Oct 2024</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                "NeoGen's dedication to sustainability and ethical practices resonates
                strongly with today's consumers, positioning the brand as a responsible
                choice in the fashion world."
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
