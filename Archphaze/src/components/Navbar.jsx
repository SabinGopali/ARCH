import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '/logo.webp';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userslice';
import { useNavigate } from 'react-router-dom';
import { selectUnseenCartCount, markCartSeen } from '../redux/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const unseenCartCount = useSelector(selectUnseenCartCount);

  const handleSignout = async () => {
    try {
      const res = await fetch('/backend/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const getDashboardLink = () => {
  if (currentUser.isAdmin) return '/dashboard';
  if (currentUser.isSupplier) return '/supplierdashboard';
  return '/userdashboard';
};

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setServicesOpen(false);
      setUserMenuOpen(false);
      setHelpOpen(false);
    }
  };

  const toggleServicesMenu = () => {
    setServicesOpen(!isServicesOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 w-full h-24 border-b border-gray-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 lg:px-16 h-full">
        <NavLink to="/" className="mt-3 flex items-center space-x-3 shrink-0">
          <img
            src={logo}
            width={200}
            height={140}
            alt="Logo"
            className="object-contain h-20 w-auto"
            style={{ maxWidth: 'none' }}
          />
        </NavLink>

        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex flex-wrap space-x-4 md:space-x-6 lg:space-x-10 bg-[#f7f8fc] px-4 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4 rounded-xl font-medium text-gray-600 text-sm md:text-base">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'text-black font-semibold' : 'hover:text-black')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/Services" className={({ isActive }) => (isActive ? 'text-black font-semibold' : 'hover:text-black')}>
                Arch Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/shopindex" className={({ isActive }) => (isActive ? 'text-black font-semibold' : 'hover:text-black')}>
                Arch Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/partners" className={({ isActive }) => (isActive ? 'text-black font-semibold' : 'hover:text-black')}>
                Partners
              </NavLink>
            </li>
            <li className="relative group">
              <div className="flex items-center gap-1 cursor-pointer hover:text-black">
                <span className="flex items-center">
                  <li className={({ isActive }) => (isActive ? 'text-black font-semibold' : '')}>Company</li>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out z-50 p-6">
                <div className="grid grid-cols-2 gap-8 text-left text-sm text-gray-700">
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">COMPANY INFO</p>
                    <ul className="space-y-1">
                      <li>
                        <NavLink to="/Aboutus" className="block hover:text-black">
                          About Us
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/careers" className="block hover:text-black">
                          Careers
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Testimonial" className="block hover:text-black">
                          Meet the Team
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Contactus" className="block hover:text-black">
                          Contact Us
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">TRUST & SAFETY</p>
                    <ul className="space-y-1">
                      <li>
                        <NavLink to="/privacynotice" className="block hover:text-black">
                          Privacy Notice
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/privacyrights" className="block hover:text-black">
                          Privacy Rights
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/termsofuse" className="block hover:text-black">
                          Terms of Use
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-x-4 lg:gap-x-6">
        {currentUser ? (
  <>
    <div className="relative group">
      <div className="cursor-pointer font-medium text-gray-700 hover:text-black flex items-center gap-1">
        Hello, {currentUser.username}
        <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50">
        {(!currentUser.isAdmin && !currentUser.isSupplier) ? (
          <>
            <Link to="/profile" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              👤 Profile
            </Link>
            <Link to="/orderhistory" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              📦 Order History
            </Link>
            
            <div className="relative">
              <div className="peer flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer">
                ❓ Help
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible peer-hover:visible peer-hover:opacity-100 hover:visible hover:opacity-100 transition-all duration-300 z-50">
                <Link to="/privacynotice" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Privacy Notice
                </Link>
                <Link to="/privacyrights" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Privacy Rights
                </Link>
                <Link to="/termsofuse" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Terms of Use
                </Link>
              </div>
            </div>
            <Link to="/settings" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              ⚙️ Account
            </Link>
            <button
              onClick={handleSignout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            {/* Admin/Supplier Menu */}
            <Link
              to="/profile"
              className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              👤 Profile
            </Link>
            <Link
              to={getDashboardLink()}
              className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              📊 Dashboard
            </Link>
            <div className="relative">
              <div className="peer flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer">
                ❓ Help
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible peer-hover:visible peer-hover:opacity-100 hover:visible hover:opacity-100 transition-all duration-300 z-50">
                <Link to="/privacynotice" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Privacy Notice
                </Link>
                <Link to="/privacyrights" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Privacy Rights
                </Link>
                <Link to="/termsofuse" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Terms of Use
                </Link>
              </div>
            </div>
            <button
              onClick={handleSignout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </div>

    {/* Cart Icon */}
    <Link to="/cart" aria-label="cart" onClick={() => dispatch(markCartSeen())} className="relative">
      <span className="text-2xl">🛒</span>
      {unseenCartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
          {unseenCartCount}
        </span>
      )}
    </Link>

    {/* Conditional Button */}
    {currentUser.isSupplier ? (
      <Link to="/Contactus">
        <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
          Any Question?
        </button>
      </Link>
    ) : (
      <Link to="/supplierlogin">
        <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
          Become a Supplier
        </button>
      </Link>
    )}
  </>
) : (
  <>
    <Link to="/login" aria-label="login">
      <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
        Log In
      </button>
    </Link>
    <Link to="/supplierlogin">
      <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
        Become a Supplier
      </button>
    </Link>
  </>
)}


        </div>

        <div className="flex md:hidden items-center space-x-4">
          {currentUser ? (
            <>
              <div className="relative">
                <button onClick={toggleUserMenu} className="text-sm font-medium text-gray-700 hover:text-black">
                  Hello, {currentUser.username} ⌄
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <Link to="/profile" onClick={toggleMobileMenu} className="block px-4 py-2 text-sm hover:bg-gray-100">
                      👤 Profile
                    </Link>

                    
                      <Link to={getDashboardLink()} onClick={toggleMobileMenu} className="block px-4 py-2 text-sm hover:bg-gray-100">
                        📊 Dashboard
                      </Link>
                  

                    <button
                      className="w-full text-left flex items-center justify-between focus:outline-none px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setHelpOpen(!isHelpOpen)}
                    >
                      ❓ Help
                      <svg
                        className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${
                          isHelpOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isHelpOpen && (
                      <ul className="pl-6 py-2 text-sm space-y-1">
                        <li>
                          <Link to="/privacynotice" onClick={toggleMobileMenu}>
                            Privacy Notice
                          </Link>
                        </li>
                        <li>
                          <Link to="/privacyrights" onClick={toggleMobileMenu}>
                            Privacy Rights
                          </Link>
                        </li>
                        <li>
                          <Link to="/termsofuse" onClick={toggleMobileMenu}>
                            Terms of Use
                          </Link>
                        </li>
                      </ul>
                    )}
                    <button onClick={handleSignout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
              <Link to="/cart" aria-label="cart" onClick={() => dispatch(markCartSeen())} className="relative">
                <span className="text-2xl">🛒</span>
                {unseenCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                    {unseenCartCount}
                  </span>
                )}
              </Link>  
            </>
          ) : (
            <>
              <Link to="/login" aria-label="login">
                <button className="px-4 md:px-5 py-1.5 md:py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm md:text-base">
                  Log In
                </button>
              </Link>
              {/* <Link to="/supplierlogin">
                <button className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm">
                  Become a Supplier
                </button>
              </Link> */}
            </>
          )}
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-gray-50 border-t border-gray-200 overflow-y-auto transition-[max-height,opacity] duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[calc(100vh-96px)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-4 text-gray-700 font-medium space-y-3 text-sm">
          <li>
            <NavLink to="/" onClick={toggleMobileMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/Services" onClick={toggleMobileMenu}>
              Arch Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/shopindex" onClick={toggleMobileMenu}>
              Arch Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/partners" onClick={toggleMobileMenu}>
              Partners
            </NavLink>
          </li>
          <li>
            <button
              className="w-full text-left flex items-center justify-between focus:outline-none"
              onClick={toggleServicesMenu}
            >
              <span>Company</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServicesOpen && (
              <ul className="mt-2 ml-4 space-y-4 text-sm">
                <li>
                  <p className="text-xs font-semibold text-red-500">COMPANY INFO</p>
                  <ul className="pl-2 mt-1 space-y-1">
                    <li>
                      <NavLink to="/Aboutus" onClick={toggleMobileMenu}>
                        About Us
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/careers" onClick={toggleMobileMenu}>
                        Careers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/Testimonial" onClick={toggleMobileMenu}>
                        Meet The Team
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
                  <p className="text-xs font-semibold text-red-500">TRUST & SAFETY</p>
                  <ul className="pl-2 mt-1 space-y-1">
                    <li>
                      <NavLink to="/privacynotice" onClick={toggleMobileMenu}>
                        Privacy Notice
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/privacyrights" onClick={toggleMobileMenu}>
                        Privacy Rights
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/termsofuse" onClick={toggleMobileMenu}>
                        Terms of Use
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/Contactus" onClick={toggleMobileMenu}>
              Contact Us
            </NavLink>
          </li>

          {/* Conditional Button inside mobile sidebar */}
          <li>
            {currentUser && currentUser.isSupplier ? (
              <Link to="/Contactus" onClick={toggleMobileMenu} className="w-full block">
                <button className="w-full px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm">
                  Any Question?
                </button>
              </Link>
            ) : (
              <Link to="/supplierlogin" onClick={toggleMobileMenu} className="w-full block">
                <button className="w-full px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition text-sm">
                  Become a Supplier
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}