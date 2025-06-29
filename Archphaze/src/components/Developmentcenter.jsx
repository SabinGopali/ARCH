import React from "react";
import { Code, BookOpen, Link2, Server } from "lucide-react";

const devSections = [
  {
    icon: <BookOpen className="w-6 h-6 text-red-500" />,
    title: "Getting Started",
    desc: "Learn how to set up Archphaze SDKs, environment variables, and access tokens in minutes.",
  },
  {
    icon: <Code className="w-6 h-6 text-red-500" />,
    title: "API Reference",
    desc: "Explore REST and GraphQL APIs with detailed documentation and usage examples.",
  },
  {
    icon: <Link2 className="w-6 h-6 text-red-500" />,
    title: "Integrations",
    desc: "Connect Archphaze to tools like GitHub, Slack, and custom CI/CD workflows.",
  },
  {
    icon: <Server className="w-6 h-6 text-red-500" />,
    title: "Webhooks & Events",
    desc: "Subscribe to key events from Archphaze and handle them securely in your app.",
  },
];

export default function Developmentcenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Archphaze <span className="text-red-500">Development Center</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Everything developers need to build, integrate, and scale with Archphaze.
        </p>
      </div>

      <div className="relative space-y-10">
        {devSections.map((section, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 md:space-x-6 group transition-all duration-300 hover:shadow-lg bg-white p-6 rounded-xl border-l-4 ${
              index % 2 === 0 ? "border-red-500" : "border-gray-300"
            }`}
          >
            <div className="flex-shrink-0 mt-1">{section.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-500 transition">
                {section.title}
              </h3>
              <p className="mt-2 text-gray-600">{section.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-2">Need technical support?</p>
        <a
          href="mailto:devsupport@archphaze.com"
          className="inline-block px-6 py-2 bg-white text-black border border-black rounded-md hover:bg-black hover:text-white transition"
        >
          Contact Developer Support
        </a>
      </div>
    </div>
  );
}
