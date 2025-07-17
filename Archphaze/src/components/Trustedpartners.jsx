import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Trustedpartners() {
  const { currentUser } = useSelector((state) => state.user);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardWidth = 320;
  const visibleCards = 3;
  const sliderRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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

  const maxIndex = Math.max(partners.length - visibleCards, 0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  if (loading) {
    return <p className="text-center py-10">Loading partners...</p>;
  }

  if (!partners.length) {
    return <p className="text-center py-10">No partners found.</p>;
  }

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto" data-aos="fade-up">
        <h2 className="text-5xl font-extrabold text-center mb-4 text-gray-800 uppercase">
          Trusted <span className="text-red-500">Partners</span>
        </h2>
        <p className="text-center max-w-xl mx-auto text-lg text-gray-600 mb-12">
          Trusted by top teams to create great design.
        </p>

        <div className="relative flex items-center gap-4">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition z-10 ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous"
          >
            &#8592;
          </button>

          {/* Slider */}
          <div className="overflow-hidden flex-1" ref={sliderRef}>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + 16)}px)`,
              }}
            >
              {partners.map((partner) => (
                <a
                  key={partner._id}
                  href={partner.c_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[320px] max-w-[320px] mx-2 flex-shrink-0"
                >
                  <motion.div
                    className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 h-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={partner.c_logo}
                      alt={partner.c_name}
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                    <div className="p-4 text-center">
                      <p className="text-lg font-medium text-gray-700">
                        {partner.c_name}
                      </p>
                    </div>
                  </motion.div>
                </a>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className={`p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition z-10 ${
              currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}
