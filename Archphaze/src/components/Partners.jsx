import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const partners = [
  {
    name: "iab.",
    img: "/logo.webp",
    description: "Digital transformation experts delivering global-scale solutions.",
    link: "https://www.iab.com/",
  },
  {
    name: "Logobrand",
    img: "/logo.webp",
    description: "Brand strategy & creative agency driving innovation.",
    link: "https://www.logobrand.com/",
  },
  {
    name: "LOGOIPSUM",
    img: "/logo.webp",
    description: "Software engineering pioneers in fintech and AI space.",
    link: "https://www.logoipsum.com/",
  },
  {
    name: "Logobrand",
    img: "/logo.webp",
    description: "Design-first company focused on product and customer experience.",
    link: "https://www.logobrand.com/",
  },
  {
    name: "iab.",
    img: "/logo.webp",
    description: "Consulting powerhouse shaping future-ready enterprises.",
    link: "https://www.iab.com/",
  },
  {
    name: "Logobrand",
    img: "/logo.webp",
    description: "Cloud-native leaders in security and data solutions.",
    link: "https://www.logobrand.com/",
  },
  {
    name: "LOGOIPSUM",
    img: "/logo.webp",
    description: "Innovators in health-tech and digital diagnostics.",
    link: "https://www.logoipsum.com/",
  },
  {
    name: "Logobrand",
    img: "/logo.webp",
    description: "CX experts reimagining user journeys and retention.",
    link: "https://www.logobrand.com/",
  },
];

const avatars = ["/logo.webp", "/logo.webp", "/logo.webp", "/logo.webp"];

const impactStats = [
  { label: "Years of Collaboration", value: "10+" },
  { label: "Active Partners", value: "120+" },
  { label: "Global Presence", value: "35 Countries" },
  { label: "Co-Innovated Projects", value: "250+" },
];

export default function Partners() {
  return (
    <section className="bg-gradient-to-br from-slate-100 to-white py-24 px-6 md:px-20 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block bg-gray-400 text-white px-5 py-1.5 rounded-full text-xs font-medium tracking-wider shadow-sm">
            OUR NETWORK
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 leading-tight tracking-tight uppercase">
            Partnering for a <span className="text-red-500">Smarter</span> Future
          </h1>
          <p className="mt-6 text-gray-600 text-lg md:text-xl">
            Strategic collaborations that empower innovation, solve industry challenges, and accelerate growth across global markets.
          </p>
        </div>

        {/* Partner Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Our Trusted Partners
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/70 border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white border border-gray-300 rounded-xl p-3 w-20 h-20 flex justify-center items-center shadow-inner">
                    <img
                      src={partner.img}
                      alt={partner.name}
                      className="max-h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {partner.description}
                </p>
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  Explore Company <FaArrowRight className="text-xs" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Text Block */}
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase">
              Impact Through <span className="text-red-500">Synergy</span>
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              We don’t just partner — we co-create. Across industries and continents, our collaborations produce measurable outcomes and bold innovations that shape tomorrow.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {impactStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 px-6 py-5 text-center hover:shadow-lg transition duration-300"
                >
                  <p className="text-3xl md:text-4xl font-extrabold text-black">{stat.value}</p>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Avatar Block with CTA */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4">Let’s Build the Future Together</h3>
            <p className="text-sm text-gray-300 mb-6">
              Join an elite group of visionaries transforming industries and driving impact through strategic partnership.
            </p>
            <div className="flex -space-x-5 mb-6">
              {avatars.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`avatar-${idx}`}
                  title={`Partner ${idx + 1}`}
                  className="w-14 h-14 rounded-full border-4 border-white shadow-md hover:scale-110 transition-transform duration-300 z-10 relative"
                  style={{ zIndex: avatars.length - idx }}
                />
              ))}
            </div>
            <button className="inline-flex items-center gap-2 bg-black text-white border border-white font-semibold py-3 px-6 rounded-full hover:bg-white hover:text-black transition duration-300 group">
              <span>Become a Partner</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
