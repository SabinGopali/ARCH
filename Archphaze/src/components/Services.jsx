import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export default function Services() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/backend/services/getservice");
        const data = await res.json();

        if (res.ok && Array.isArray(data.services)) {
          setServices(data.services);
        } else if (res.ok && Array.isArray(data)) {
          setServices(data);
        } else {
          console.error("Unexpected response:", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    
      fetchServices();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });
  }, []);

  const isVideo = (link) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(link || "");
  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

  return (
    <div className="bg-white py-20 px-6 md:px-12">
      <Helmet>
        <meta
          name="description"
          content="Explore our professional services in custom software development, mobile apps, UI/UX design, and API integration."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto" data-aos="fade-up">
        <h1 className="text-5xl font-extrabold text-center mb-6 uppercase">
          Arch <span className="text-red-500">Services</span>
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Empowering your ideas with technology that works.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services available.</p>
        ) : (
          <div className="space-y-20">
            {services.map((item, index) => {
              const isReversed = index % 2 === 1;
              const aosAnimation = isReversed ? 'fade-right' : 'fade-left';
              const mediaSrc = item.s_link?.startsWith("/uploads/")
                ? `${backendURL}${item.s_link}`
                : item.s_link;

              return (
                <div
                  key={item._id || index}
                  data-aos={aosAnimation}
                  className={`flex flex-col md:flex-row items-center justify-between gap-12 ${isReversed ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Rectangle Video Box */}
                  <div className="md:w-1/2">
                    <div className="bg-[#f5f6ff] p-2 w-fit mx-auto shadow-sm">
                      <div className="relative overflow-hidden w-[320px] h-[180px]">
                        
                        {isVideo(mediaSrc) ? (
                          <video
                            src={`http://localhost:3000/${item.s_link}`}
                            autoPlay
                            muted
                            loop
                            disablePictureInPicture
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                            No video
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="md:w-1/2 px-4 md:px-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {item.s_title}
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      {item.s_description}
                    </p>
                    <button
                      onClick={() => {
                        localStorage.setItem("fromLearnMore", "true");
                        navigate("/#closing-section");
                      }}
                      className="inline-flex items-center gap-2 bg-white text-black border border-black hover:bg-black hover:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
                    >
                      {item.cta || "Learn More"} <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
