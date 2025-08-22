import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const plans = [
  {
    id: 1,
    title: "Asset Management System",
    description:
      "For businesses looking to manage assets efficiently with essential tracking and monitoring features.",
    price: "19",
    image: "https://dummyimage.com/100x100/000/fff.png&text=AMS", // replace with real image
    aos: "fade-right",
  },
  {
    id: 2,
    title: "E-Commerce System",
    description:
      "For growing businesses that need advanced tools, analytics, and scalability to boost online sales.",
    price: "39",
    image: "https://dummyimage.com/100x100/000/fff.png&text=Ecom", // replace with real image
    aos: "zoom-in",
  },
  {
    id: 3,
    title: "Free Tier",
    description:
      "For beginners who want to explore the system with limited features at no cost.",
    price: "0",
    image: "https://dummyimage.com/100x100/000/fff.png&text=Free", // replace with real image
    aos: "fade-left",
  },
];

const Subscriptioncard = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="bg-gray-50 py-12 flex justify-center">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full px-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            data-aos={plan.aos}
            className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-500"
          >
            <img
              src={plan.image}
              alt={plan.title}
              className="w-28 h-28 object-contain mb-6 animate-pulse"
            />
            <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
            <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              Rs. {plan.price}
            </div>
            <p className="text-gray-500 mb-6">/month</p>
            <button className="bg-black text-white py-3 px-6 rounded-xl w-full hover:bg-gray-800 transition duration-300">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptioncard;
