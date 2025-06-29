import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Submit logic here
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          If You Have Any <span className="text-red-500">Query</span>, Please <br className="hidden sm:block" />
          <span className="text-red-500">Contact Us</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Contact Info */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in touch</h3>
          <p className="text-gray-700 mb-6">
            We’d love to hear from you! Whether you have a question about our services, need assistance,
            or just want to provide feedback, our team is ready to help.
          </p>

          <div className="space-y-6 text-gray-800">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <MapPin className="w-5 h-5" />
                <span>Location:</span>
              </div>
              <p className="ml-7">Kalimati-13, Kathmandu, Nepal</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <Mail className="w-5 h-5" />
                <span>Email:</span>
              </div>
              <p className="ml-7">info@example.com</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <Phone className="w-5 h-5" />
                <span>Call:</span>
              </div>
              <p className="ml-7">+977-9999999999, +977-9999999999</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone.no"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            <div >
              <button type="submit" className="px-5 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
                Send us message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full h-[300px] sm:h-[400px] mt-16 rounded-xl overflow-hidden shadow-md">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13026.427238943295!2d85.28174274164017!3d27.699050667404098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1860ae22d385%3A0x7c2444e8284cef52!2sKalimati%2C%20Kathmandu%2044600!5e1!3m2!1sen!2snp!4v1747642856636!5m2!1sen!2snp"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
