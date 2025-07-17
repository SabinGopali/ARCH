import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

import logo from "/archphaze.webp";
import front from "../assets/frontshop.jpg";
import leftfront from "../assets/leftfront.jpg";
import rightfront from "../assets/rightfront.jpg";
import Scrollingcards from "./Scrollingcards";
import Techintro from "./Techintro";
import Category from "./Category";

export default function ProductShowcase() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const productImages = [logo, logo]; // Replace with real product URLs as needed

  return (
    <div className="min-h-screen bg-white px-4 py-16 flex flex-col items-center text-center">
      {/* Main Heading */}
      <h1
        className="text-3xl md:text-5xl font-extrabold text-gray-800 uppercase leading-tight max-w-3xl"
        data-aos="fade-up"
      >
        <em className="italic font-medium text-red-500 uppercase">Smart, Sleek</em>
        <span className="inline-flex items-center justify-center mx-2">
          <span className="text-red-500 text-2xl">⚡</span>
        </span>
        tech solutions <br />
        for the Next <span className="text-red-500">Generation</span>
      </h1>

      {/* Search Bar */}
      <div className="mt-8 w-full max-w-xl flex" data-aos="fade-up">
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
      <div
        className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center"
        data-aos="fade-up"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-8 items-center">
          {productImages.map(( i) => (
            <div
              key={i}
              className="w-36 sm:w-40 aspect-square rounded-2xl border border-gray-200 shadow-lg bg-gray-100 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden"
            >
              <img
                src={leftfront}
                alt={`Product ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Center Main Product */}
        <div className="flex justify-center">
          <div className="w-64 sm:w-80 md:w-96 aspect-square rounded-3xl border border-gray-300 shadow-2xl bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
            <img
              src={front}
              alt="Main Product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-8 items-center">
          {productImages.map((i) => (
            <div
              key={i + 2}
              className="w-36 sm:w-40 aspect-square rounded-2xl border border-gray-200 shadow-lg bg-gray-100 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden"
            >
              <img
                src={rightfront}
                alt={`Product ${i + 3}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Cards Section */}
      <div className="mt-20 w-full" data-aos="fade-up">
        <Scrollingcards />
      </div>

      {/* Tech Introduction Section */}
      <div className="mt-20 w-full" data-aos="fade-up">
        <Techintro />
      </div>

      {/* Category Section */}
      <div className="mt-20 w-full" data-aos="fade-up">
        <Category />
      </div>
    </div>
  );
}
