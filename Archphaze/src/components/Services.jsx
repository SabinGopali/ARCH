import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from 'react-helmet';
import WebDevImg from '../assets/webimg.jpg';
import MobileAppImg from '../assets/mobimg.jpg';
import UIUXImg from '../assets/uiimg.jpg';
import ApiImg from '../assets/apiimg.jpg';

const data = [
  {
    img: WebDevImg,
    title: 'Custom Software Development',
    para: 'We build secure, scalable, and high-performance software tailored to your business needs — from internal tools to full enterprise systems.',
    cta: 'Request a quote',
  },
  {
    img: MobileAppImg,
    title: 'Mobile App Development',
    para: 'Deliver seamless mobile experiences across iOS and Android with native and cross-platform apps that users love.',
    cta: 'Start your app',
  },
  {
    img: UIUXImg,
    title: 'UI/UX Design Services',
    para: 'Design intuitive user interfaces and meaningful experiences that boost engagement and simplify interaction across platforms.',
    cta: 'View our design work',
  },
  {
    img: ApiImg,
    title: 'API Development & Integration',
    para: 'Create and connect RESTful or GraphQL APIs to enable data exchange, third-party services, and system interoperability.',
    cta: 'Explore API solutions',
  }
];

export default function Services() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });
  }, []);

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

        <div className="space-y-20">
          {data.map((item, index) => {
            const isReversed = index % 2 === 1;
            const aosAnimation = isReversed ? 'fade-left' : 'fade-right';

            return (
              <div
                key={index}
                data-aos={aosAnimation}
                className={`flex flex-col-reverse md:flex-row items-center gap-10 ${
                  isReversed ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Text Section */}
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-700 text-base mb-4 leading-relaxed">{item.para}</p>
                  <button className="bg-white text-black border border-black px-5 py-2.5 rounded hover:bg-black hover:text-white transition font-medium">
                    {item.cta}
                  </button>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-red-100 via-white to-blue-100 p-[3px] shadow-lg transform transition duration-300 hover:scale-105 hover:-translate-y-1">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
