import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const impactStats = [
  { label: "Years of Collaboration", value: "10+" },
  { label: "Active Partners", value: "120+" },
  { label: "Global Presence", value: "35 Countries" },
  { label: "Co-Innovated Projects", value: "250+" },
];

export default function Partners() {
  const { currentUser } = useSelector((state) => state.user);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/backend/Partners/getPartner");
        const data = await res.json();

        if (res.ok && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else if (res.ok && Array.isArray(data)) {
          setPartners(data);
        } else {
          console.error("Unexpected response:", data);
          setPartners([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

   
      fetchPartners();
    
  }, []);

  const avatarImages = partners.slice(0, 4).map((partner) => partner.c_logo);

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
          <h2 className="text-2xl font-extrabold text-gray-800 mb-8 text-center uppercase">
            Our Trusted Partners
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading partners...</p>
          ) : partners.length === 0 ? (
            <p className="text-center text-gray-500">No partners available.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {partners.map((partner, index) => (
                <div
                  key={partner._id || index}
                  className="backdrop-blur-md bg-white/70 border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white border border-gray-300 rounded-xl p-3 w-20 h-20 flex justify-center items-center shadow-inner">
                      <img
                        src={partner.c_logo}
                        alt={partner.c_name}
                        className="max-h-12 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{partner.c_name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {partner.c_description}
                  </p>
                  <Link
                    to={partner.c_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Explore Company <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
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

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4">Let’s Build the Future Together</h3>
            <p className="text-sm text-gray-300 mb-6">
              Join an elite group of visionaries transforming industries and driving impact through strategic partnership.
            </p>
            <div className="flex -space-x-5 mb-6">
              {avatarImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`avatar-${idx}`}
                  title={`Partner ${idx + 1}`}
                  className="w-14 h-14 rounded-full border-4 border-white shadow-md hover:scale-110 transition-transform duration-300 z-10 relative"
                  style={{ zIndex: avatarImages.length - idx }}
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
