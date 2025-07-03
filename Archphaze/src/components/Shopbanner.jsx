import React from "react";
import ProductImage from "/archphaze.webp"; // Replace with your product/3D logo

export default function Shopbanner() {
  return (
    <div className="bg-white px-4 py-1 md:py-2 flex items-center">
      <div className="w-full max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-red-200 via-red-200 to-red-400 p-[2px] shadow-xl overflow-hidden">
        <div className="flex flex-col-reverse md:flex-row items-center bg-[#0f0f0f] rounded-3xl px-6 py-6 md:px-12 md:py-8">

          {/* Left: Text Content */}
          <div className="md:w-1/2 w-full text-center md:text-left text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-white to-red-300">
                Shop the Future <br />
              </span>
              with Arch Tech
            </h1>
            <p className="text-gray-100 text-base sm:text-lg md:text-xl mb-6 opacity-90">
              Discover powerful, innovative, and premium tech products. The tools you need, designed with elegance and precision.
            </p>
            <button className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-black hover:text-white border border-white transition duration-300">
              Explore Products
            </button>
          </div>

          {/* Right: Image Preview */}
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src={ProductImage}
              alt="Arch Tech Product"
              className="w-64 sm:w-72 md:w-96 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
