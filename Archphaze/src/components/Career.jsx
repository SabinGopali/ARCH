import React from "react";
import img from "../assets/careerimg.jpg"; // Make sure this image has no visible border
import { Helmet } from "react-helmet";

const JoinOurTeam = () => {
  return (
    <>
      <Helmet>
        
        <meta
          name="description"
          content="Discover exciting career opportunities at Archphaze Technologies. We're hiring developers, designers, and engineers who are passionate about innovation and growth."
        />
      </Helmet>

      <section className="bg-white px-6 py-16 lg:px-20 text-gray-800 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text Section */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase leading-tight">
              Join Our <span className="text-red-500">Team</span>
            </h1>

            <p className="text-lg text-gray-600">
              Join our journey to enhance great software to perfection!
            </p>

            {/* Job Table */}
            <div className="overflow-auto shadow-sm rounded-xl border border-gray-200">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left">Position</th>
                    <th className="px-4 py-3 text-left">Vacancy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Frontend Developer", 2],
                    ["Backend Developer", 3],
                    ["Full Stack Developer", 1],
                    ["Mobile App Developer", 2],
                    ["DevOps Engineer", 1],
                    ["QA Engineer", 2],
                    ["UI/UX Designer", 1],
                  ].map(([position, vacancy], i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{position}</td>
                      <td className="px-4 py-2">{vacancy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Company Culture */}
            <p className="text-gray-700 leading-relaxed text-justify">
              We are a dynamic team of dedicated, vibrant minds, united in our mission to deliver unparalleled technical support to both local and global brands. Our culture thrives on collaboration, devoid of hierarchies—every voice is valued, every idea welcomed. Whether you're experienced or just starting out, we'd love to hear from you.
            </p>

            {/* Email Prompt */}
            <p className="text-gray-700">
              Send your resume to{" "}
              <span className="text-red-500 font-semibold">info@example.com</span>{" "}
              to explore a career at{" "}
              <span className="text-red-500 font-semibold">Archphaze Technologies</span>.
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full flex justify-center lg:justify-end">
                <img
                  src={img}
                  alt="Team collaboration illustration"
                  className="w-full max-w-lg lg:max-w-xl object-contain"
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
        </div>
      </section>
    </>
  );
};

export default JoinOurTeam;
