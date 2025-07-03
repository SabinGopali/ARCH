import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClosingPage() {
  return (
    <div className="relative min-h-[60vh] bg-white text-gray-900 flex flex-col items-center justify-center px-8 py-16 overflow-hidden">
      {/* Layered Background Glow + Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft central radial glow */}
        <div
          className="
            absolute
            top-1/2 left-1/2
            w-[600px] h-[600px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-white
            blur-[140px]
            opacity-60
            animate-[pulse_8s_ease-in-out_infinite]
          "
        />
        {/* Bottom right warm glow */}
        <div
          className="
            absolute bottom-12 right-12
            w-[35%] h-[35%]
            bg-white
            rounded-full
            blur-[110px]
            opacity-50
            animate-[pulse_10s_ease-in-out_infinite]
          "
        />
        {/* Top left cool undertone */}
        <div
          className="
            absolute top-10 left-10
            w-[30%] h-[30%]
            bg-white
            rounded-full
            blur-[100px]
            opacity-40
            animate-[pulse_10s_ease-in-out_infinite]
          "
        />

        {/* Floating subtle particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute
              bg-white
              rounded-full
              opacity-10
              blur-sm
              ${i % 2 === 0 ? "w-2 h-2" : "w-3 h-3"}
              animate-float-smooth
            `}
            style={{
              top: `${18 + i * 13}%`,
              left: `${12 + i * 11}%`,
              animationDuration: `${9 + i * 2}s`,
              animationDelay: `${i * 1.7}s`,
            }}
          />
        ))}
      </div>

      {/* SVG Dotted Wave Background */}
      <div className="absolute bottom-0 right-0 w-full max-w-4xl z-0 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 600 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#f87171" />
            </pattern>
          </defs>
          <path
            d="M0 100 C 110 160, 220 60, 330 110 C 440 160, 550 60, 600 110"
            fill="url(#dots)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Main Text */}
      <h1 className="relative text-4xl md:text-5xl font-extrabold text-center z-10 leading-snug max-w-xl uppercase tracking-wide text-gray-900 drop-shadow-md">
        Ready to build something <br />
        <span className="text-red-600">amazing together?</span> <br />
        <span className="text-gray-700 font-semibold text-2xl md:text-3xl mt-2 block">
          Let’s chat.
        </span>
      </h1>

      {/* CTA Button */}
      <Link
        to="/contactus"
        className="
          mt-10
          inline-flex
          items-center
          px-8
          py-3
          bg-white
          text-black
          border border-black
          rounded-full
          shadow-lg
          hover:bg-black
          hover:text-white
          transition
          duration-300
          ease-in-out
          font-semibold
          text-lg
          select-none
          group
          drop-shadow-md
        "
      >
        Talk to Us
        <ArrowUpRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
          .animate-pulse-slow {
            animation: pulse 8s ease-in-out infinite;
          }
          .animate-pulse-slower {
            animation: pulse 10s ease-in-out infinite;
          }
          @keyframes float-smooth {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-float-smooth {
            animation: float-smooth 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
