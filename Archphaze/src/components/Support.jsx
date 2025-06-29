import React, { useState } from "react";

const faqContent = {
  "Product Installation": [
    "How do I install the Archphaze software on Windows or macOS?",
    "Can I install your app on multiple devices with a single license?",
    "Why am I getting installation errors or system incompatibility warnings?",
  ],
  "Licensing & Billing": [
    "How do I activate or renew my license key?",
    "Where can I manage or cancel my subscription?",
    "Can I get a refund if I cancel early?",
  ],
  "Account & Access": [
    "How do I reset my password or recover my account?",
    "How can I enable multi-factor authentication?",
    "Can I transfer my account to another user or email?",
  ],
  "Bugs & Issues": [
    "How do I report a bug or crash in the app?",
    "Where can I view known issues or upcoming fixes?",
    "How quickly do bugs get resolved?",
  ],
  "Integrations & API": [
    "How do I connect Archphaze to Slack, GitHub, or other tools?",
    "Where is your API documentation located?",
    "What authentication method does your API use?",
  ],
  "Privacy & Security": [
    "How is my data stored and secured?",
    "Where can I find your GDPR & compliance policies?",
    "How do I delete my data permanently?",
  ],
};

export default function SupportCenter() {
  const [expanded, setExpanded] = useState({});

  const toggle = (category, index) => {
    const key = `${category}-${index}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black uppercase">Support <span className="uppercase text-red-500">Center</span> </h1>
          <p className="text-gray-600 mt-2">Help for your software and technical products from Archphaze.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center uppercase">Frequently Asked Questions</h2>
          {Object.entries(faqContent).map(([category, questions]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">{category}</h3>
              <ul className="space-y-2">
                {questions.map((q, i) => {
                  const key = `${category}-${i}`;
                  return (
                    <li key={key}>
                      <button
                        onClick={() => toggle(category, i)}
                        className="w-full text-left text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <div className="flex justify-between items-center border-b border-dashed pb-2">
                          <span>{q}</span>
                          <span className="text-sm text-gray-400">{expanded[key] ? "−" : "+"}</span>
                        </div>
                      </button>
                      {expanded[key] && (
                        <div className="mt-2 text-sm text-gray-500 pl-4">
                          This is a placeholder answer. You can link to documentation, videos, or provide detailed help here.
                        </div>  
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Details Box */}
        <div className="bg-black rounded-xl p-6 text-center text-white shadow-md mt-8">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="mt-2 text-sm">Need personalized support? Reach out to our team.</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              📧 Email:{" "}
              <a href="mailto:support@archphaze.com" className="underline hover:text-red-300">
                support@archphaze.com
              </a>
            </p>
            <p className="text-sm">
              ☎️ Phone:{" "}
              <a href="tel:18001234567" className="underline hover:text-red-300">
                +1 (800) 123-4567
              </a>
            </p>
            <p className="text-sm py-3">🕒 Support Hours: Mon–Fri, 9 AM – 6 PM (UTC)</p>
          </div>
          <button className="px-4 md:px-5 py-1.5 md:py-2 border border-white rounded-md hover:bg-white hover:text-black transition cursor-pointer text-sm md:text-base">
              Contact Us
            </button>
        </div>
      </div>
    </div>
  );
}
