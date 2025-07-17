import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Testimonial() {
  const { currentUser } = useSelector((state) => state.user);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch("/backend/team/getteam");
        const data = await res.json();

        if (res.ok && Array.isArray(data.teams)) {
          setTeamMembers(data.teams);
        } else {
          console.error("Unexpected response:", data);
          setTeamMembers([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    
      fetchTeamMembers();
  
  }, []);

  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

  return (
    <section className="bg-white py-20 px-4 lg:px-20">
      <Helmet>
        <meta
          name="description"
          content="Meet the passionate and skilled team behind Archphaze Technologies. From developers to leadership, we deliver innovation and excellence."
        />
      </Helmet>

      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase" data-aos="fade-up">
          Meet <span className="text-red-500">Our Team</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          The passionate minds building powerful digital experiences.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading team members...</p>
      ) : teamMembers.length === 0 ? (
        <p className="text-center text-gray-500">No team members found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => {
            const imageUrl = member.t_image?.startsWith("/uploads/")
              ? `${backendURL}${member.t_image}`
              : member.t_image;

            return (
              <motion.div
                key={member._id || index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                   src={
                    member.t_image
                      ? `http://localhost:3000/${member.t_image}`
                      : "https://via.placeholder.com/40x40?text=No+Image"
                  }
                    alt={`${member.Username} - ${member.t_post}`}
                    className="w-24 h-24 object-cover rounded-full shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{member.Username}</h3>
                    <p className="text-sm text-red-500 font-medium capitalize">{member.t_post}</p>
                  </div>
                  <p className="text-gray-500 text-sm">{member.t_description}</p>

                  <div className="flex gap-4 pt-2">
                    {member.t_lnlink && (
                      <a
                        href={member.t_lnlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {member.t_fblink && (
                      <a
                        href={member.t_fblink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400"
                      >
                        <FaTwitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
