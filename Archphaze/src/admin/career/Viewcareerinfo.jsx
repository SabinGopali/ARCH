import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function Updatecareerinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const [position, setPosition] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCareerInfo = async () => {
      try {
        const res = await fetch(`/backend/Career/getCareers/${id}`);
        const data = await res.json();

        console.log("Fetched career data:", data);

        if (!res.ok) {
          setError(data.message || "Failed to fetch career information.");
          setFetching(false);
          return;
        }

        setPosition(data.position || "");
        setVacancy(data.vacancies || "");
        setFetching(false);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching data.");
        setFetching(false);
      }
    };

    if (id) {
      fetchCareerInfo();
    } else {
      setError("No career ID provided.");
      setFetching(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position.trim()) return setError("Position is required");
    if (!vacancy || parseInt(vacancy) <= 0)
      return setError("Vacancies must be at least 1");

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`/backend/Career/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position,
          vacancies: vacancy,
          userRef: currentUser?._id,
          userMail: currentUser?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Failed to update career info.");
        setLoading(false);
        return;
      }

      navigate("/careerinfo");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    if (position === "" && vacancy === "") {
      navigate(-1);
    } else {
      setPosition("");
      setVacancy("");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Career Information
          </h2>

          {fetching ? (
            <p className="text-center text-gray-600">Loading data...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Position Title
                </label>
                <input
                  id="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="vacancy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Vacancies
                </label>
                <input
                  id="vacancy"
                  type="number"
                  value={vacancy}
                  onChange={(e) => setVacancy(e.target.value)}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                  placeholder="e.g. 2"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancelOrBack}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
                >
                  {position === "" && vacancy === "" ? "Back" : "Clear"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
