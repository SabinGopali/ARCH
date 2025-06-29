import React from "react";
import { FaSearch } from "react-icons/fa";
import logo from "/archphaze.webp";
import Scrollingcards from "./Scrollingcards";
import Techintro from "./Techintro";

export default function ProductShowcase() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 flex flex-col items-center text-center">
      {/* Main Heading */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 uppercase leading-tight max-w-3xl">
        <em className="italic font-medium text-red-500 uppercase">Smart, Sleek</em>
        <span className="inline-flex items-center justify-center mx-2">
          <span className="text-red-500 text-2xl">⚡</span>
        </span>
        tech solutions <br />
        for the Next <span className="text-red-500">Generation</span>
      </h1>

      {/* Search Bar */}
      <div className="mt-8 w-full max-w-xl flex">
        <input
          type="text"
          placeholder="Search tech products..."
          className="flex-grow px-5 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-md"
        />
        <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-r-full hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-md">
          <FaSearch />
        </button>
      </div>

      {/* Product Grid */}
      <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* Left Side */}
        <div className="flex flex-col gap-8 items-center">
          <img
            src={logo}
            alt="Product1"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-gray-300 shadow-lg"
          />
          <img
            src={logo}
            alt="Product2"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-gray-300 shadow-lg"
          />
        </div>

        {/* Center Main Product */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Main Product"
            className="w-full max-w-md rounded-2xl border border-gray-300 shadow-xl"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-8 items-center">
          <img
            src={logo}
            alt="Product3"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-gray-300 shadow-lg"
          />
          <img
            src={logo}
            alt="Product4"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-gray-300 shadow-lg"
          />
        </div>
      </div>

      {/* Scrolling Cards Section */}
      <div className="mt-20 w-full">
        <Scrollingcards />
      </div>
        <div className="mt-20 w-full">
        <Techintro />
      </div>
    </div>
  );
}
