import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userslice';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '/logo.webp'
import OAuth from './OAuth';

export default function Login() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
     
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) {
        return dispatch(signInFailure('Please fill all the fields'))
      }
      try {
        dispatch(signInStart());
        const res = await fetch('/backend/auth/signin', {
          method: 'POST',
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          
          dispatch(signInFailure(data.message));
        }

        if(res.ok) {
          dispatch(signInSuccess(data));
          navigate('/');
        }
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
    }
  
  return (
<div className="flex items-center justify-center min-h-screen">
      <div className="md:bg-slate-200 p-8 rounded-lg shadow-lg flex w-2/3 max-w-4xl sm:w-fit sm:ml-5 sm:mr-5 sm:bg-transparent">
        {/* Left Side - 3D Illustration */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={Logo} alt="Illustration" className="w-80" />
        </div>
        {/* Right Side - Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Sign In</h2>
          <p className="text-gray-600 text-center mb-4">Sign in for further</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-md " placeholder="Enter your email" id="email"
              onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input type="password" className="w-full px-4 py-2 border rounded-md " placeholder="Enter your password" id="password"
              onChange={handleChange} />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-80"
            disabled={loading}>{
              loading ? 'Loading...' : 'Login'
            }</button>
          </form>
          <OAuth/>
          <p className="text-center text-gray-600 mt-4">
          Don't have an account? <Link to='/signup' className="text-blue-500">Create an account</Link>
          </p>
          {
            errorMessage && (
              <div className='p-4 mt-2 mb-4 text-sm text-red-600 rounded-lg bg-red-100 " role="alert'>
                <span className="font-medium">Error!</span> {errorMessage}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
