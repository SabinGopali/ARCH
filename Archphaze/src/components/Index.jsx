import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReactTyped } from "react-typed";
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
 // ✅

import Services from '../components/Services';
import Whyus from './Whyus';
import Testimonial from './Testimonial';
import { Link } from 'react-router-dom';
import ThreeDModel from './ThreeDmodel';
import Shopbanner from './Shopbanner';
import Trustedpartners from './Trustedpartners';
import ClosingPage from './Closingpage';
import Clienttestimonial from './Clienttestimonial';

export default function Index() {
    const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // ✅ Scroll to top if no hash (initial load or refresh)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // ✅ Scroll to anchor if hash exists
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <>
      <Helmet>
        <title>Archphaze</title>
        <meta
          name="description"
          content="Archphaze Technologies delivers innovative tech solutions for businesses. Discover our services in web, mobile, and cloud development tailored to your success."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-white pt-2 md:pt-4 pb-12 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col-reverse md:grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text */}
          <div className="text-center md:text-left space-y-4" data-aos="fade-right">
            <p className="text-red-500 uppercase font-semibold tracking-wider text-sm sm:text-base mb-1">
              BUILD.HOST.LAUNCH
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
              Innovative <span className="text-red-500">Tech Solutions</span> for Your Business
            </h1>
            <ReactTyped
              className="text-gray-600 text-base sm:text-lg md:text-xl"
              strings={['Empowering startups and enterprises with modern web and mobile technologies. Let’s create something impactful together.']}
              typeSpeed={40}
            />
            <div className="mt-6">
  <Link to="/Contactus">
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      className="group px-6 py-3 text-sm sm:text-base font-semibold rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl hover:brightness-110 transition-all duration-300 relative overflow-hidden"
    >
      <span className="relative z-10">Build With Us</span>

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      />
    </motion.button>
  </Link>
</div>
          </div>

          {/* 3D Section */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex justify-center items-center" data-aos="fade-left">
            <div className="w-full h-full">
              <ThreeDModel modelPath="/office.gltf" />
            </div>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <Services />
      <Whyus />
      <Shopbanner/>
      <Testimonial />
      <Trustedpartners/>

      {/* ✅ Anchor target for Learn More */}
      <div id="closing-section" className="ClosingPage">
        <ClosingPage />
      </div>

      <Clienttestimonial />
    </>
  );
}
