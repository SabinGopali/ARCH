import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '/logo.webp';
import OAuth from './OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message || 'Failed to sign up.');
      }
      setPendingEmail(formData.email);
      setOtpStep(true);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
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
      navigate('/login');
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        
        {/* Logo */}
        <div className="flex justify-center mt-2">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 sm:h-14 md:h-16 object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {!otpStep ? (
          <>
            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                id="username"
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                id="email"
                onChange={handleChange}
                placeholder="Email address (Gmail only)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                id="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Auth Button */}
            <OAuth />

            {/* Redirect link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
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
              <button disabled={loading} className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <button disabled={loading} onClick={handleResend} className="w-full py-2 text-sm text-blue-600 hover:underline">
              Resend OTP
            </button>
          </>
        )}

        {/* Error alert */}
        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
