import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '/logo.webp';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return setErrorMessage('Please enter a valid 6-digit OTP.');
    }
    
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('http://localhost:3000/backend/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: parseInt(otp) }),
      });
      
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      
      setLoading(false);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch('http://localhost:3000/backend/auth/resend-verification-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setSuccessMessage('New OTP sent to your email.');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">Please complete the signup process first.</p>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

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

        <h2 className="text-2xl font-bold text-center text-gray-800">Verify Your Email</h2>
        <p className="text-center text-gray-600">
          We've sent a 6-digit code to <span className="font-semibold">{email}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) setOtp(value);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-xl tracking-widest"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResendOtp}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Resend OTP
          </button>
        </p>

        {/* Success message */}
        {successMessage && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
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