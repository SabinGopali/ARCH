import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Closingpage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    exisiting_website: '',
    service_select: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.fullname || !formData.email || !formData.phone || !formData.service_select || !formData.description) {
      return setError("Please fill all required fields.");
    }

    try {
      setLoading(true);

      const res = await fetch("/backend/form/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser?._id,
          userMail: currentUser?.email
        })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        return setError(data.message || "Submission failed.");
      }

      setSuccessMessage("Form submitted successfully!");
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        exisiting_website: '',
        service_select: '',
        description: '',
      });
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section className="bg-white w-full py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* Left Section */}
        <div className="w-full md:w-1/2" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-snug uppercase">
            Let’s Build Something <br />
            <span className="text-red-500">Great Together!</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Have a project in mind or need expert advice? We’re here to help!
            Reach out to us for a consultation, and let’s bring your vision to life
            with innovative, people-friendly digital solutions.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div
          className="w-full md:w-[650px] bg-white shadow-2xl rounded-[40px] border border-gray-200 p-8 md:p-14"
          data-aos="fade-up"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Get In Touch Now
          </h3>

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name*"
                className="w-full border border-gray-300 p-4 text-lg rounded-xl shadow-sm"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email*"
                className="w-full border border-gray-300 p-4 text-lg rounded-xl shadow-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone No*"
                className="w-full border border-gray-300 p-4 text-lg rounded-xl shadow-sm"
                required
              />
              <input
                type="text"
                name="exisiting_website"
                value={formData.exisiting_website}
                onChange={handleChange}
                placeholder="Existing Website"
                className="w-full border border-gray-300 p-4 text-lg rounded-xl shadow-sm"
              />
            </div>

            <div>
              <select
                name="service_select"
                value={formData.service_select}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 text-lg rounded-xl shadow-sm"
                required
              >
                <option value="">Select Service*</option>
                <option value="Developer">Web Development</option>
                <option value="Designer">UI/UX Design</option>
                <option value="Manager">Project Management</option>
                <option value="CEO">Business Strategy</option>
                <option value="CTO">Technical Consulting</option>
              </select>
            </div>

            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share Your Requirement*"
                className="w-full border border-gray-300 p-4 text-lg rounded-xl h-32 resize-none shadow-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black border border-black py-4 text-lg rounded-xl font-semibold hover:bg-black hover:text-white transition shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
