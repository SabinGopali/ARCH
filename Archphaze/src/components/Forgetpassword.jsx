import React, { useState } from "react";
import logo from "/logo.webp";

export default function Forgetpassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a submit event or call your backend here
    alert(`Reset link sent to: ${email}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-sm sm:text-base text-gray-500">
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition-all text-base font-medium"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <a
            href="/login"
            className="text-blue-600 hover:underline text-sm sm:text-base"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
