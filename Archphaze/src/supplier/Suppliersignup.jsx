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
    setErrorMessage('Email/password supplier sign up is disabled. Please use Google below.');
    return;
  };

  const businessOptions = [
    { id: 'exportBusiness', label: 'Export Internationally', icon: <FaShip className="text-3xl" /> },
    { id: 'ecommerceBusiness', label: 'Online Store', icon: <FaShoppingBag className="text-3xl" /> },
    { id: 'wholesaleBusiness', label: 'Wholesale Supplier', icon: <FaWarehouse className="text-3xl" /> },
    { id: 'manufacturingBusiness', label: 'Manufacturer', icon: <FaIndustry className="text-3xl" /> },
  ];

  const getBusinessTypes = () => [
    formData.exportBusiness && 'Export Internationally',
    formData.ecommerceBusiness && 'Online Store',
    formData.wholesaleBusiness && 'Wholesale Supplier',
    formData.manufacturingBusiness && 'Manufacturer',
  ].filter(Boolean);

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
        <p className="text-center text-gray-600 mb-6">Use Google to continue. Gmail accounts only.</p>

        {errorMessage && <p className="text-red-600 text-center text-sm mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold text-lg cursor-not-allowed">
            Sign Up (Use Google below)
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <OAuth
            endpoint="/backend/auth/google-supplier"
            extraBody={() => ({
              company_name: formData.company_name,
              company_location: formData.company_location,
              phone: formData.phone,
              businessTypes: getBusinessTypes(),
            })}
          />

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/supplierlogin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
