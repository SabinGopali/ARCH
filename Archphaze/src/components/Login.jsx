import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userslice';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '/logo.webp';
import OAuth from './OAuth';

export default function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/backend/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      if (res.ok) {
        dispatch(signInSuccess(data));

        // Optional: store supplierId for sub-user
        if (data.isSubUser && data.supplierId) {
          localStorage.setItem('supplierId', data.supplierId);
        }

        // Redirect based on user type
        if (data.isAdmin) {
          navigate('/dashboard');
        } else if (data.isSupplier || data.isSubUser) {
          navigate('/supplierdashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">

        {/* Left Side - Logo */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 sm:h-14 md:h-16 object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Sign In</h2>
          <p className="text-gray-600 text-center">Sign in for further</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="text-right">
                <Link
                  to="/forgetpassword"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-80"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <OAuth />

          {/* Redirect */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
