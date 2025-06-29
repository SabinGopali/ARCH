import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-700 py-12 px-6 sm:px-10 border-t border-gray-200 w-full shadow-sm">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Archphaze Technologies Pvt. Ltd
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            © {year}. All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-6">
          <Link
            to="https://www.facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition"
          >
            <FaFacebook size={18} className="sm:size-5" />
          </Link>
          <Link
            to="https://www.twitter.com"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition"
          >
            <FaTwitter size={18} className="sm:size-5" />
          </Link>
          <Link
            to="https://www.instagram.com"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition"
          >
            <FaInstagram size={18} className="sm:size-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
