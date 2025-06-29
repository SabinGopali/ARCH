import React, { useState } from "react";
import logo from "/archphaze.webp";
import { Link } from "react-router-dom";

export default function Careers() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Review applications and CV's",
      description:
        "Send us your portfolio (please make it relevant) and a CV (please make it 1 page only). You can apply for one of the open positions or send us your application anyway.",
      image: logo,
    },
    {
      title: "Interview invitation",
      description:
        "If your CV and portfolio match our needs, we’ll invite you for an interview.",
      image: logo,
    },
    {
      title: "The interview",
      description:
        "You’ll have a conversation with our team where we’ll talk about your experience, skills, and ambitions.",
      image: logo,
    },
    {
      title: "Test task",
      description:
        "You'll be given a task that reflects real work we do. It's your time to shine.",
      image: logo,
    },
    {
      title: "Now you're one of us!",
      description: "Once everything’s cleared, we welcome you aboard!",
      image: logo,
    },
  ];

  const benefits = [
    { title: "Flexible working hours", image: logo },
    { title: "Remote work", image: logo },
    { title: "Access to top tools and software", image: logo },
    { title: "Latest hardware", image: logo },
    { title: "Office next to the National Stadium", image: logo },
    { title: "Animal-friendly office", image: logo },
    { title: "Various forms of employment contracts", image: logo },
    { title: "Salary reviews", image: logo },
    { title: "Referral bonuses", image: logo },
    { title: "Paid time off", image: logo },
    { title: "Unlimited sick leave", image: logo },
    { title: "Flexible career path", image: logo },
    { title: "Team building events", image: logo },
    { title: "Feedback culture", image: logo },
    { title: "International team", image: logo },
    { title: "No dress code", image: logo },
  ];

  return (
    <div className="bg-white text-black">
      {/* HERO SECTION */}
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <span className="inline-block bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
              Why and What is Archphaze
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight uppercase">
              We are <span className="text-red-500">embarking</span> on a <br className="hidden md:block" /> profound
              <span className="text-red-500"> mission</span>
            </h1>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Started as a dream to empower product development workflows.
              It’s a haven where experience and functionality converge.
            </p>
            <Link to="/career">
              <div className="mt-6">
                <button className="bg-white text-black border border-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition duration-200">
                  See All Positions
                </button>
              </div>
            </Link>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[...Array(6)].map((_, idx) => (
              <img
                key={idx}
                src={logo}
                alt={`image-${idx}`}
                className="rounded-2xl object-cover w-full h-52 md:h-64 shadow-md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* WORK MODE SECTION */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 uppercase">
                How & Where We <span className="text-red-500">Work</span>
              </h2>
              <p className="font-semibold text-gray-900 mb-4">
                We empower our employees to do their best work, wherever they are.
              </p>
              <p className="text-gray-700 mb-4">
                At Archphaze Nepal, we embrace both in-site and remote working models. Whether you're working from our Kathmandu office
                or from the comfort of your home in Pokhara, Biratnagar, or anywhere across Nepal, we ensure equitable access, inclusion, and support.
              </p>
              <p className="text-gray-700">
                Our work model is designed to maximize productivity and collaboration, aligned with our team’s and clients’ goals.
              </p>
            </div>
            <div className="flex-1">
              <img src={logo} alt="Work illustration" className="w-full max-w-md mx-auto" />
            </div>
          </div>

          {/* WORK MODE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2">In-Site (Kathmandu Office)</h3>
              <p className="font-semibold text-gray-800 mb-2">
                You split your time between working from home and our office.
              </p>
              <p className="text-gray-700">
                In-site team members are connected to our Kathmandu hub. Some projects require in-person collaboration,
                so the schedule depends on your team’s needs.
              </p>
            </div>
            <div className="border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2">Remote (Across Nepal)</h3>
              <p className="font-semibold text-gray-800 mb-2">
                Work from anywhere across Nepal – Pokhara, Butwal, or your home!
              </p>
              <p className="text-gray-700">
                Remote team members are fully supported with collaboration tools and flexibility. You can occasionally visit the office,
                but are not required to.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <h2 className="text-4xl font-extrabold text-center mb-10 uppercase">Benefits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="relative group h-40 rounded-xl border bg-white overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 p-4 flex items-center justify-center text-center"
              >
                <div className="z-10 text-black group-hover:opacity-0 transition-opacity duration-300">
                  <p className="font-medium">{item.title}</p>
                </div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECRUITMENT PROCESS SECTION */}
      <div className="py-16">
        <div className="flex flex-col md:flex-row gap-8 px-4 lg:px-20 max-w-7xl mx-auto">
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{steps[activeStep].title}</h3>
              <p className="text-gray-600">{steps[activeStep].description}</p>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-extrabold mb-6 uppercase">Recruitment process</h2>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left px-4 py-3 rounded-full border font-medium transition-all ${
                    activeStep === index
                      ? "bg-black text-white"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {`0${index + 1}`} {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA BANNER SECTION */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-gray-600 rounded-2xl px-6 py-12 mx-4 md:mx-20 my-16 shadow-lg">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0 md:space-x-6">
    <div>
      <h2 className="text-3xl font-bold text-white">
        Stay up to date and learn more about us
      </h2>
      <p className="text-white text-opacity-80 mt-2 max-w-md">
        Get the latest insights, product updates, and stories from the Archphaze team.
      </p>
    </div>
    <div>
      <Link
        to="/career"
        className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-lg shadow hover:bg-black hover:text-white transition duration-300">
Join Our Team      </Link>
    </div>
  </div>
</div>

    </div>
  );
}
