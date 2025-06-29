import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaRocket,
  FaShieldAlt,
  FaPiggyBank,
} from "react-icons/fa";
import logo from "../assets/chooseimg.jpg";
import AOS from "aos";
import { Helmet } from "react-helmet";
import "aos/dist/aos.css";

const features = [
  {
    icon: <FaCode className="text-4xl text-black" />,
    title: "Custom Development",
    desc: "Tailored software to suit your business goals.",
  },
  {
    icon: <FaRocket className="text-4xl text-black" />,
    title: "Fast Deployment",
    desc: "Quick launch without compromising quality.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-black" />,
    title: "Cyber Security",
    desc: "End-to-end encryption and monitoring.",
  },
  {
    icon: <FaPiggyBank className="text-4xl text-black" />,
    title: "Cost Efficiency",
    desc: "Affordable plans with maximum ROI.",
  },
];

export default function Whyus() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section
      className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20"
      aria-labelledby="whyus-heading"
    >
      <Helmet>
     
        <meta
          name="description"
          content="Discover why businesses choose Archphaze Technologies for software development, cyber security, and cost-effective IT solutions."
        />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        {/* Text Section */}
        <div className="space-y-8">
          <h1
            id="whyus-heading"
            className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight"
            data-aos="fade-up"
          >
            WHY <span className="text-red-500">CHOOSE</span> US?
          </h1>

          <p className="text-lg text-gray-600" data-aos="fade-up" data-aos-delay="100">
            We provide innovative and scalable IT solutions tailored to your business.
            From cloud deployments to secure infrastructure and intelligent software—
            trust us to deliver excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex justify-center lg:justify-end"
        >
          <img
            src={logo}
            alt="Illustration of IT professional working to provide service excellence"
            className="w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
