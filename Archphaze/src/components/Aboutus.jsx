import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import image from '../assets/aboutusimg.jpg';

export default function Aboutus() {
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  const content = {
    about: {
      title: '✓ Who are We',
      paragraphs: [
        `At Archphaze Technologies, we specialize in delivering top-tier IT solutions to businesses, offering cutting-edge web solutions tailored for your success. With a seasoned team boasting experience across diverse industries, we consistently innovate to drive client success.`,
        `Our approach prioritizes critical information, ensuring professionalism and post-implementation support for enduring results. Driven by innovation, we constantly push boundaries, presenting fresh ideas and approaches to ensure your success.`,
        `We prioritize essential information, maintaining a high level of professionalism while delivering impactful results. Join us, and let's embark on a journey of growth, innovation, and unparalleled success together.`,
      ],
    },
    mission: {
      title: '✓ Our Mission',
      paragraphs: [
        `Our mission is to empower businesses through innovative and scalable IT solutions that simplify complexities, enhance operational efficiency, and drive measurable growth.`,
        `We aim to be a trusted technology partner, delivering value by aligning our solutions with your business objectives. Our goal is to make technology accessible, reliable, and transformative for organizations of all sizes.`,
      ],
    },
    vision: {
      title: '✓ Our Vision',
      paragraphs: [
        `Our vision is to become a global leader in IT services by constantly evolving, adapting to emerging technologies, and setting industry benchmarks in quality, performance, and innovation.`,
        `We envision a world where businesses, regardless of size, thrive through technology that is secure, intuitive, and future-ready.`,
      ],
    },
  };

  return (
    <section className="bg-white max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 py-16">
      <Helmet>
        
        <meta
          name="description"
          content="Learn more about Archphaze Technologies—who we are, our mission, and our vision. Discover how we empower businesses with innovative IT solutions."
        />
      </Helmet>

      <div>
        {/* Title */}
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2"
          data-aos="fade-up"
        >
          About <span className="text-red-500">US</span>
        </motion.h2>

        <motion.h3
          className="text-xl sm:text-2xl text-gray-600 font-medium mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Archphaze Technologies Pvt. Ltd.
        </motion.h3>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-300 mb-8 text-lg font-medium">
          {['about', 'mission', 'vision'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition-all ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              {tab === 'about'
                ? 'About Us'
                : tab === 'mission'
                ? 'Our Mission'
                : 'Our Vision'}
            </button>
          ))}
        </div>

        {/* Content & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12">
          {/* Text Content */}
          <motion.div
            
          >
            <p className="text-red-500 font-semibold mb-2">{content[activeTab].title}</p>
            {content[activeTab].paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-gray-700 text-justify leading-relaxed text-base sm:text-lg mb-4"
              >
                {para}
              </p>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center"
            data-aos="fade-up"
        
          >
            <div className="max-w-lg w-full">
              <img
                src={image}
                alt="About Company"
                className="w-full object-contain rounded-3xl transition-transform duration-500 hover:scale-105"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
