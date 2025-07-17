import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdVisibility, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Careerinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch("/backend/career/getCareer");
        const data = await res.json();

        if (res.ok && Array.isArray(data.careers)) {
          setCareers(data.careers);
        } else if (res.ok && Array.isArray(data)) {
          setCareers(data);
        } else {
          console.error("Unexpected response:", data);
          setCareers([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchCareers();
    }
  }, [currentUser?._id]);


  const handleApplicationDelete = async (id) => {
  try {
    const res = await fetch(`/backend/Career/deleteCareer/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (res.ok) {
      // Update the careers state by filtering out the deleted career
      setCareers((prev) => prev.filter((career) => career._id !== id));
    } else {
      console.log(data.message || "Failed to delete the career.");
    }
  } catch (error) {
    console.log(error.message);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Career Info</h2>
            <Link to="/addcareerinfo">
              <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm">
                + Add Career Info
              </button>
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading careers...</p>
          ) : careers.length === 0 ? (
            <p className="text-gray-500">No career info available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Position</th>
                    <th className="py-2 px-4">Vacancy</th>
                    <th className="py-2 px-4">Posted By</th>
                    <th className="py-2 px-4">Created Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((career, index) => (
                    <tr
                      key={career._id || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{career.position}</td>
                      <td className="py-3 px-4 text-gray-700">{career.vacancies}</td>
                      <td className="py-3 px-4 text-gray-700">{career.userMail}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {career.createdAt
                          ? new Date(career.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {/* <Link to={`/viewcareerinfo/${career._id}`}>
                          <button
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            title="View"
                          >
                            <MdVisibility size={18} />
                          </button>
                        </Link> */}
                        <Link to={`/updatecareerinfo/${career._id}`}>
                          <button
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                            title="Edit"
                          >
                            <MdEdit size={18} />
                          </button>
                        </Link>
                        <button
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              title="Delete"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this career?")) {
                                  handleApplicationDelete(career._id);
                                }
                              }}
                            >
                              <MdDelete size={18} />
                            </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
