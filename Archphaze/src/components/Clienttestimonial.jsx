import React, { useEffect, useState, useRef } from "react";
import { FaQuoteRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Clienttestimonial() {
  const { currentUser } = useSelector((state) => state.user);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/backend/client/getclient");
        const data = await res.json();

        if (res.ok && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          console.error("Unexpected response:", data);
          setClients([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

   
      fetchClients();
    
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 bg-white relative overflow-hidden w-full">
      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 uppercase">
          What Our <span className="text-red-500">Clients Say</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Real feedback from businesses that trust us! See how we help brands grow.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 md:px-12"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="col-span-full text-left">Loading testimonials...</p>
        ) : clients.length === 0 ? (
          <p className="col-span-full text-left text-gray-500">No client testimonials available.</p>
        ) : (
          clients.map((client) => (
            <div
              key={client._id}
              className="bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between relative hover:shadow-2xl transition-all duration-300 min-h-[320px]"
            >
              <FaQuoteRight className="text-3xl text-red-500 absolute top-6 right-6" />
              <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-8">
                {client.description || "No feedback provided by this client."}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t">
                <img
                  src={
                    client.client_image
                      ? `http://localhost:3000/${client.client_image}`
                      : "https://via.placeholder.com/40x40?text=No+Image"
                  }
                  alt={client.company_name || "Client"}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {client.userName || client.userMail || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">{client.company_name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      <div className="flex justify-center mt-10 max-w-8xl mx-auto px-6 md:px-12" data-aos="fade-up">
        <Link to="/Contactus">
          <button className="bg-white text-black border border-black hover:bg-black hover:text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300">
            Get a Free Consultation
          </button>
        </Link>
      </div>
    </section>
  );
}
