import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CiUser } from 'react-icons/ci';
import logo from '/logo.webp';
import {useSelector, useDispatch} from 'react-redux';


export default function Navbar() {

  const {currentUser} = useSelector(state => state.user);
  



  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setServicesOpen(false);
  };

  const toggleServicesMenu = () => {
    setServicesOpen(!isServicesOpen);
  };


  return (
    <nav className="bg-white sticky top-0 z-50 w-full h-24 border-b border-gray-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 lg:px-16 h-full">
        <NavLink to="/" className="mt-3 flex items-center space-x-3 shrink-0">
          <img src={logo} width={200} height={140} alt="Logo" className="object-contain h-20 w-auto" style={{ maxWidth: 'none' }} />
        </NavLink>

        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex flex-wrap space-x-4 md:space-x-6 lg:space-x-10 bg-[#f7f8fc] px-4 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4 rounded-xl font-medium text-gray-600 text-sm md:text-base">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Home</NavLink></li>
            <li><NavLink to="/Services" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Arch Services</NavLink></li>
            <li><NavLink to="/productmodal" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Arch Shop</NavLink></li>
            <li><NavLink to="/partners" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Partners</NavLink></li>

            <li className="relative group">
              <div className="flex items-center gap-1 cursor-pointer hover:text-black">
                <span className="flex items-center">
                  <NavLink to="/" className={({ isActive }) => isActive ? 'text-black font-semibold' : ''}>Company</NavLink>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out z-50 p-6">
                <div className="grid grid-cols-2 gap-8 text-left text-sm text-gray-700">
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">COMPANY INFO</p>
                    <ul className="space-y-1">
                      <li><NavLink to="/Aboutus" className="block hover:text-black">About Us</NavLink></li>
                      <li><NavLink to="/careers" className="block hover:text-black">Careers</NavLink></li>
                      <li><NavLink to="/Testimonial" className="block hover:text-black">Meet the Team</NavLink></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">TRUST & SAFETY</p>
                    <ul className="space-y-1">
                      <li><NavLink to="/privacynotice" className="block hover:text-black">Privacy Notice</NavLink></li>
                      <li><NavLink to="/privacyrights" className="block hover:text-black">Privacy Rights</NavLink></li>
                      <li><NavLink to="/termsofuse" className="block hover:text-black">Terms of Use</NavLink></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li><NavLink to="/Contactus" className={({ isActive }) => isActive ? 'text-black font-semibold' : 'hover:text-black'}>Contact Us</NavLink></li>
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-x-4 lg:gap-x-6">
          
              {currentUser ? ( <Link to="/cart" aria-label="cart"><span className="text-2xl">🛒</span></Link>):
                (<Link to="/signup" aria-label="login">
            <CiUser className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </Link>)
              }
         
          <Link to="/Contactus">
            <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">Any Question?</button>
          </Link>
        </div>

        <div className="flex md:hidden items-center space-x-4">
          {currentUser ? ( <Link to="/cart" aria-label="cart"><span className="text-2xl">🛒</span></Link>):
                (<Link to="/signup" aria-label="login">
            <CiUser className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </Link>)
              }
          <button onClick={toggleMobileMenu} className="text-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-gray-50 border-t border-gray-200 overflow-y-auto transition-[max-height,opacity] duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-96px)] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col px-6 py-4 text-gray-700 font-medium space-y-3 text-sm">
          <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/Services" onClick={() => setMobileMenuOpen(false)}>Arch Services</NavLink></li>
          <li><NavLink to="/productmodal" onClick={() => setMobileMenuOpen(false)}>Arch Shop</NavLink></li>
          <li><NavLink to="/partners" onClick={() => setMobileMenuOpen(false)}>Partners</NavLink></li>
          <li>
            <button className="w-full text-left flex items-center justify-between focus:outline-none" onClick={toggleServicesMenu}>
              <span>Company</span>
              <svg className={`w-4 h-4 transform transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServicesOpen && (
              <ul className="mt-2 ml-4 space-y-4 text-sm">
                <li>
                  <p className="text-xs font-semibold text-red-500">COMPANY INFO</p>
                  <ul className="pl-2 mt-1 space-y-1">
                    <li><NavLink to="/Aboutus" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink></li>
                    <li><NavLink to="/careers" onClick={() => setMobileMenuOpen(false)}>Careers</NavLink></li>
                    <li><NavLink to="/Testimonial" onClick={() => setMobileMenuOpen(false)}>Meet The Team</NavLink></li>
                  </ul>
                </li>
                <li>
                  <p className="text-xs font-semibold text-red-500">TRUST & SAFETY</p>
                  <ul className="pl-2 mt-1 space-y-1">
                    <li><NavLink to="/privacynotice" onClick={() => setMobileMenuOpen(false)}>Privacy Notice</NavLink></li>
                    <li><NavLink to="/privacyrights" onClick={() => setMobileMenuOpen(false)}>Privacy Rights</NavLink></li>
                    <li><NavLink to="/termsofuse" onClick={() => setMobileMenuOpen(false)}>Terms of Use</NavLink></li>
             
                  </ul>
                </li>
              </ul>
            )}
          </li>
          <li><NavLink to="/Contactus" onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink></li>
      
          <li>
            <Link to="/Contactus">
              <button className="w-full text-center cursor-pointer px-5 py-2 border border-black rounded-md hover:bg-black hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>Build With Us</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
