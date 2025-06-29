import React, { useState } from "react";

const faqContent = {
  "Data Collection": [
    "What types of personal data does Archphaze collect?",
    "How does Archphaze collect data from my devices?",
    "Is any data collected automatically?",
  ],
  "Data Usage": [
    "How is my personal data used by Archphaze products?",
    "Do you use my data for marketing or third-party purposes?",
    "Can I limit how my data is used?",
  ],
  "Data Sharing": [
    "Does Archphaze share my data with third parties?",
    "Under what circumstances is data shared with partners or affiliates?",
    "Are my details sold to advertisers?",
  ],
  "Data Protection": [
    "How does Archphaze protect my personal data?",
    "What security measures are in place for cloud storage?",
    "How long do you retain my data?",
  ],
  "User Rights": [
    "How can I access or correct my personal data?",
    "How do I request deletion of my data (right to be forgotten)?",
    "How can I opt out of data collection or tracking?",
  ],
  "Compliance & Policies": [
    "Is Archphaze GDPR and CCPA compliant?",
    "Where can I view your full Privacy Policy?",
    "How do I report a privacy violation or concern?",
  ],
};

export default function Privacynotice() {
  const [expanded, setExpanded] = useState({});

  const toggle = (category, index) => {
    const key = `${category}-${index}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black uppercase">Privacy <span className="text-red-500">Notice</span>  Help <span className="text-red-500">Center</span> </h1>
          <p className="text-gray-600 mt-2">Your privacy matters — find answers to common privacy-related questions.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center uppercase">Privacy & data FAQs</h2>
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
                          Placeholder answer. Customize this with your actual privacy handling policies, user guidance, and official links.
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Details */}
        <div className="bg-black rounded-xl p-6 text-center text-white shadow-md mt-8">
          <h3 className="text-xl font-semibold">Contact Our Privacy Team</h3>
          <p className="mt-2 text-sm">Still have concerns about your data? Reach out to our privacy officers directly.</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              📧 Email:{" "}
              <a href="mailto:privacy@archphaze.com" className="underline hover:text-red-300">
                privacy@archphaze.com
              </a>
            </p>
            <p className="text-sm">
              ☎️ Phone:{" "}
              <a href="tel:18004567890" className="underline hover:text-red-300">
                +1 (800) 456-7890
              </a>
            </p>
            <p className="text-sm">🕒 Hours: Mon–Fri, 9 AM – 5 PM (UTC)</p>
          </div>
          <button className="mt-4 px-4 md:px-5 py-1.5 md:py-2 border border-white rounded-md hover:bg-white hover:text-black transition cursor-pointer text-sm md:text-base">
              Submit Privacy Request
            </button>
        </div>
      </div>
    </div>
  );
}
