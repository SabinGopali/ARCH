import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '/logo.webp';
import OAuth from './OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // ✅ Move testConnection function outside of handleSubmit
  const testConnection = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/health');
      if (res.ok) {
        const data = await res.json();
        alert(`Server is running: ${data.message}`);
      } else {
        alert('Server responded with error');
      }
    } catch (error) {
      alert(`Cannot connect to server: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      
      // ✅ Use the correct endpoint with /backend prefix
      const res = await fetch('http://localhost:3000/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      // Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
      }
      
      const data = await res.json();
      
      if (data.success === false) {
        throw new Error(data.message);
      }
      
      // Navigate to OTP page with email
      navigate('/otp', { state: { email: formData.email } });
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
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

        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

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
            placeholder="Email address"
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
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
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

        {/* Test Connection Button */}
        <button
          type="button"
          onClick={testConnection}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Test Server Connection
        </button>

        {/* Redirect link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

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