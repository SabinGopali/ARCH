import React from "react";
import logo from '/logo.webp';

export default function TechIntro() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center bg-white min-h-screen">
      {/* Left Content Section */}
      <div className="md:w-1/2 w-full p-8">
        <p className="text-center text-gray-500 text-sm italic">-Innovating Everyday Experiences-</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-4 uppercase">
          Empowering Businesses with <span className="text-red-500">Software Intelligence</span>  & Smart <span className="text-red-500">Tech products</span>
        </h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-6">
          At Archphaze, we blend cutting-edge software development with product-driven innovation. 
          From intuitive enterprise platforms to smart, connected devices — our mission is to create seamless digital experiences that scale with your growth.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-2xl font-bold text-gray-900">15+</p>
            <p className="text-sm text-gray-500">Years of Excellence</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-2xl font-bold text-gray-900">120+</p>
            <p className="text-sm text-gray-500">Tech Products Shipped</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-2xl font-bold text-gray-900">30K+</p>
            <p className="text-sm text-gray-500">Code Deployments</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-2xl font-bold text-gray-900">500K+</p>
            <p className="text-sm text-gray-500">Global Users</p>
          </div>
        </div>

        {/* Quote */}
        

        {/* Button */}
        <div className="text-center">
          <button className="bg-white text-black border border-black px-6 py-2 rounded hover:bg-[black] hover:text-[white] transition">
            Discover Our Platform
          </button>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 w-full p-8">
        <div className="rounded-r-[200px] overflow-hidden shadow-lg">
          <img
            src={logo}
            alt="TechNova Logo"
            className="w-full h-full object-contain bg-gray-50 p-8"
          />
        </div>
      </div>
    </section>
  );
}
