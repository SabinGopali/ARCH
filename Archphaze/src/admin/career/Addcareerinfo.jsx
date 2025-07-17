import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Sidebar";

export default function Addcareerinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    position: '',
    vacancies: '',
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.position.trim()) return setError('Position is required');
    if (!formData.vacancies || parseInt(formData.vacancies) <= 0) return setError('Vacancies must be at least 1');

    try {
      setLoading(true);
      setError(false);

      const res = await fetch('/backend/Career/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          userMail: currentUser.email,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        return setError(data.message);
      }

      navigate(`/careerinfo`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    if (formData.position === "" && formData.vacancies === "") {
      navigate(-1); // Go back
    } else {
      setFormData({
        position: '',
        vacancies: '',
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Career Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Position Field */}
            <div className="group">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position Title
              </label>
              <input
                id="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. Frontend Developer"
              />
            </div>

            {/* Vacancy Field */}
            <div className="group">
              <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Vacancies
              </label>
              <input
                id="vacancies"
                type="number"
                value={formData.vacancies}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. 2"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
              >
                {formData.position === "" && formData.vacancies === "" ? "Back" : "Clear"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
