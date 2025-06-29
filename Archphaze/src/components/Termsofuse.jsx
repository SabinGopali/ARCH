import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const termsSections = [
  {
    title: "General Terms",
    content:
      "Use of Archphaze software and services requires agreement to our Terms of Use. These terms may change without prior notice. Continued use indicates acceptance of all updates.",
  },
  {
    title: "User Responsibilities",
    content:
      "You are responsible for safeguarding your credentials and ensuring the software is used according to laws. Reverse-engineering, reselling, or unauthorized access is strictly prohibited.",
  },
  {
    title: "Intellectual Property",
    content:
      "Archphaze owns all intellectual property rights to its software and branding. Unauthorized use of our assets, including code, trademarks, and design, is prohibited without consent.",
  },
  {
    title: "Limitations of Liability",
    content:
      "Archphaze is not liable for data loss, service interruptions, or indirect damages. Use our software at your own risk. We make no guarantees of error-free or uninterrupted service.",
  },
  {
    title: "Termination & Suspension",
    content:
      "We may suspend or terminate access for violations of these terms. Users may delete accounts by contacting support. On termination, all active licenses are voided immediately.",
  },
  {
    title: "Governing Law & Disputes",
    content:
      "These terms are governed by U.S. law. Any disputes must be resolved through binding arbitration in our jurisdiction. Use of the software outside the U.S. is at your own discretion.",
  },
];

export default function Termsofuse() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black uppercase">
            Terms of <span className="text-red-500">Use</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Understand your rights and obligations when using Archphaze software.
          </p>
        </div>

        <div className="space-y-6">
          {termsSections.map((section, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg shadow-sm transition-all duration-300 bg-white"
            >
              <button
                onClick={() => toggleSection(i)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-red-50 rounded-t-lg text-left"
              >
                <span className="text-lg font-semibold text-gray-800">{section.title}</span>
                <span className="text-2xl text-gray-400">{openIndex === i ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 text-gray-700 bg-white border-t border-gray-200 rounded-b-lg">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact Info Box */}
        <div className="bg-black rounded-xl p-6 text-center text-white shadow-md mt-10">
          <h3 className="text-xl font-semibold">Questions About These Terms?</h3>
          <p className="mt-2 text-sm">Reach out to our legal team for clarification or help.</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              📧 Email:{" "}
              <a href="mailto:legal@archphaze.com" className="underline hover:text-red-300">
                legal@archphaze.com
              </a>
            </p>
            <p className="text-sm">
              ☎️ Phone:{" "}
              <a href="tel:18001234567" className="underline hover:text-red-300">
                +1 (800) 123-4567
              </a>
            </p>
            <p className="text-sm py-3">🕒 Mon–Fri, 10 AM – 5 PM (UTC)</p>
          </div>
          <button className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-black transition text-sm">
            Contact Legal Team
          </button>
        </div>
      </div>
    </div>
  );
}
