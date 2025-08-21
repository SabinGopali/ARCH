import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShip, FaShoppingBag, FaWarehouse, FaIndustry } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import Logo from '/logo.webp';
import OAuth from '../components/OAuth';

export default function Suppliersignup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    company_location: '',
    phone: '',
    exportBusiness: false,
    ecommerceBusiness: false,
    wholesaleBusiness: false,
    manufacturingBusiness: false,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: typeof value === 'string' ? value.trim() : value }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitted(false);

    const {
      username,
      email,
      password,
      company_name,
      company_location,
      phone,
      exportBusiness,
      ecommerceBusiness,
      wholesaleBusiness,
      manufacturingBusiness,
    } = formData;

    if (!username || !email || !password || !company_name || !company_location || !phone) {
      return setErrorMessage('Please fill out all required fields.');
    }

    try {
      setLoading(true);
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          company_name,
          company_location,
          phone,
          businessTypes: [
            exportBusiness && 'Export Internationally',
            ecommerceBusiness && 'Online Store',
            wholesaleBusiness && 'Wholesale Supplier',
            manufacturingBusiness && 'Manufacturer',
          ].filter(Boolean),
          isSupplier: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setErrorMessage(data.message || 'Something went wrong.');
      }

      setSubmitted(true);
      setPendingEmail(email);
      setOtpStep(true);
      setLoading(false);
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || !pendingEmail) return;
    try {
      setLoading(true);
      const res = await fetch('/backend/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message || 'Invalid OTP.');
      }
      setLoading(false);
      navigate('/supplierlogin');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    try {
      setLoading(true);
      const res = await fetch('/backend/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message || 'Failed to resend OTP.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage('Failed to resend OTP.');
    }
  };

  const businessOptions = [
    { id: 'exportBusiness', label: 'Export Internationally', icon: <FaShip className="text-3xl" /> },
    { id: 'ecommerceBusiness', label: 'Online Store', icon: <FaShoppingBag className="text-3xl" /> },
    { id: 'wholesaleBusiness', label: 'Wholesale Supplier', icon: <FaWarehouse className="text-3xl" /> },
    { id: 'manufacturingBusiness', label: 'Manufacturer', icon: <FaIndustry className="text-3xl" /> },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-10 relative">
      {submitted && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow flex items-center gap-3 animate-fade-in z-50">
          <FiCheckCircle className="text-xl text-green-600" />
          <p className="text-sm font-medium">Successfully signed up!</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-14 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Supplier Account</h2>
        <p className="text-center text-gray-600 mb-6">Enter your details and business info to get started</p>

        {errorMessage && <p className="text-red-600 text-center text-sm mb-4">{errorMessage}</p>}

        {!otpStep ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="username" onChange={handleChange} placeholder="Full name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
            <input name="email" type="email" onChange={handleChange} placeholder="Email address (Gmail only)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
            <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />

            <input name="company_name" onChange={handleChange} placeholder="Company Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
            <input name="company_location" onChange={handleChange} placeholder="Company Location" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />

            <div className="flex items-center">
              <span className="px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">+977</span>
              <input
                name="phone"
                type="tel"
                onChange={handleChange}
                placeholder="9801234567"
                className="flex-1 border border-gray-300 border-l-0 rounded-r-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <p className="text-gray-700 font-medium text-sm mt-6 mb-2">Business type (choose all that apply)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {businessOptions.map(({ id, label, icon }) => (
                <div
                  key={id}
                  onClick={() => handleToggle(id)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 ${
                    formData[id] ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.01]' : 'bg-white hover:border-blue-300'
                  }`}
                >
                  <input type="checkbox" id={id} checked={formData[id]} onChange={() => handleToggle(id)} className="hidden" />
                  <div className={`text-blue-600 mb-2 ${formData[id] ? 'scale-110' : 'scale-100'}`}>{icon}</div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition">
              {loading ? 'Loading...' : 'Sign Up'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <OAuth />

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/supplierlogin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">We sent a 6-digit OTP to <span className="font-semibold">{pendingEmail}</span>. Enter it below to verify your email.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center"
              />
              <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <button disabled={loading} onClick={handleResend} className="w-full py-2 text-sm text-blue-600 hover:underline">
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
