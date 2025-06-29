import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";
import logo from "/logo.webp";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-700 py-16 px-6 sm:px-10 md:px-20 border-t border-gray-200 w-full">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 text-sm">

        {/* Logo & Info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            <img
                        src={logo}
                        width={200}
                        height={140}
                        alt="Logo"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="object-contain h-20 w-auto"
                        style={{ maxWidth: 'none' }}
                      />
            
          </Link>
          <p className="text-xs text-gray-500">©{year} Archphaze | All Rights Reserved.</p>
         
        </div>

        {/* Social & Legal */}
        <div>
          <h4 className="text-black font-semibold text-base mb-4">Social & Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacynotice" className="hover:text-black transition">Archphaze Development Center</Link></li>
            <li><Link to="/privacynotice" className="hover:text-black transition">Terms of Use</Link></li>
            <li><Link to="/privacynotice" className="hover:text-black transition">Privacy Notice</Link></li>
            <li><Link to="/privacyrights" className="hover:text-black transition">Your Privacy Rights</Link></li>
            <li><Link to="/cookies" className="hover:text-black transition">Cookie Preferences</Link></li>
            
           
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-black font-semibold text-base mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services/itconsulting" className="hover:text-black transition">IT Consulting</Link></li>
            <li><Link to="/services/cloudsolutions" className="hover:text-black transition">Cloud Solutions</Link></li>
            <li><Link to="/services/webdevelopment" className="hover:text-black transition">Web Development</Link></li>
            <li><Link to="/services/cybersecurity" className="hover:text-black transition">Cybersecurity</Link></li>
            <li><Link to="/services/maintenance" className="hover:text-black transition">Ongoing Maintenance</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-black font-semibold text-base mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-black transition">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-black transition">Careers</Link></li>
            <li><Link to="/contactus" className="hover:text-black transition">Contact</Link></li>
            <li><Link to="/support" className="hover:text-black transition">Support</Link></li>
            
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="text-black font-semibold text-base mb-4">Get in Touch</h4>
          <p className="text-sm text-gray-500 mb-4">Questions or feedback? We'd love to hear from you.</p>
          <div className="flex space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border text-black hover:bg-gray-100 transition">
              <FaFacebookF size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border text-black hover:bg-gray-100 transition">
              <FaTwitter size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border text-black hover:bg-gray-100 transition">
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
