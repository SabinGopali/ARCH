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
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.para}</p>
                  <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition">
                    {item.cta}
                  </button>

                  {/* Related links */}
                  
                </div>

                {/* Image/Icon Section */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-64 h-64 flex items-center justify-center bg-orange-50 rounded-full shadow-inner p-4">
                    <img src={item.img} alt={item.title} className="object-contain h-40" />
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
