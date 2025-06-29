import React from "react";
import { FaGoogle } from "react-icons/fa";
import logo from "/logo.webp";
import { Link } from "react-router-dom";

export default function Adlogin() {
  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/signin";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 md:p-10 space-y-6">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-800">Admin Login</h2>

        {/* Login Form */}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition-all text-base sm:text-lg font-medium">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
