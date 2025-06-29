import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import Logo from '/logo.webp'
import OAuth from './OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage]= useState(null);
  const [loading, setLoading] = useState(false);
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
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return setErrorMessage(data.message);
          
        }
        setLoading(false);
        if(res.ok) {
          navigate('/login');
        }
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
    
    
    
  return (
<div className="flex items-center justify-center min-h-screen">
      <div className="bg-slate-200 p-8 rounded-lg shadow-lg flex w-2/3 max-w-4xl sm:w-fit">
        
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create an account</h2>
          <p className="text-gray-600 text-center mb-4">Join for exclusive access!</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md " placeholder="Enter your full name"
              id='username' onChange={handleChange}  />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-md " placeholder="Enter your email"
             id='email' onChange={handleChange}  />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input type="password" className="w-full px-4 py-2 border rounded-md " placeholder="Enter your password"
             id='password' onChange={handleChange}  />
            </div>
            
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}>
              {
                loading ? 'Loading...' : 'Sign up'
              }
            </button>
          </form>
          <OAuth/>
          <p className="text-center text-gray-600 mt-4">
            Already have an account? <Link to='/login' className="text-blue-500">Sign in</Link>
          </p>
          
          {/* alert */}
          {
            errorMessage && (
              <div className='p-4 mt-2 mb-4 text-sm text-red-600 rounded-lg bg-red-100 " role="alert'>
                <span class="font-medium">Error!</span> {errorMessage}
              </div>
            )
          }
          
        </div>
        
        <div className="w-1/2 flex items-center justify-center">
          <img src={Logo} alt="Illustration" className="w-80" />
        </div>
        
      </div>
    </div>
  )
}