import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdVisibility } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Queriesinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalForms, setTotalForms] = useState(0);
  const [lastMonthForms, setLastMonthForms] = useState(0);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetch("/backend/form/getform", {
          credentials: "include", // ensure auth is sent
        });
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.forms)) {
          setQueries(data.forms);
          setTotalForms(data.totalforms || 0);
          setLastMonthForms(data.lastMonthforms || 0);
        } else {
          console.error("Unexpected response format:", data);
          setQueries([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchQueries();
    }
  }, [currentUser?._id]);

  const handleDeleteQuery = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this query?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/backend/form/deleteform/${id}`, {
        method: "DELETE",
        credentials: "include", // send cookies for authentication
      });

      const data = await res.json();

      if (res.ok) {
        setQueries((prev) => prev.filter((query) => query._id !== id));
        alert("Query deleted successfully.");
      } else {
        alert(data.message || "Failed to delete query.");
      }
    } catch (error) {
      console.error("Error deleting query:", error.message);
    }
  };

  // helper: check if current user can delete the query
  const canDelete = (query) => {
    return currentUser?.isAdmin || query.userRef === currentUser?._id;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Queries List</h2>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>Total Queries: <strong>{totalForms}</strong></p>
            <p>Last 30 Days: <strong>{lastMonthForms}</strong></p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-gray-500">Loading queries...</p>
            ) : queries.length === 0 ? (
              <p className="text-gray-500">No queries found.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Full Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Service</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Posted By</th>
                    <th className="py-2 px-4">Created Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((query, index) => (
                    <tr key={query._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{query.fullname}</td>
                      <td className="py-3 px-4 text-gray-700">{query.email}</td>
                      <td className="py-3 px-4 text-gray-700">{query.service_select}</td>
                      <td className="py-3 px-4 text-gray-700">{query.description}</td>
                      <td className="py-3 px-4 text-gray-700">{query.userMail}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {query.createdAt
                          ? new Date(query.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {/* View button */}
                        <Link to={`/viewqueriesinfo/${query._id}`}>
                          <button
                            title="View"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <MdVisibility size={18} />
                          </button>
                        </Link>

                        {/* Delete button: only show if user can delete */}
                        {canDelete(query) && (
                          <button
                            onClick={() => handleDeleteQuery(query._id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            title="Delete"
                          >
                            <MdDelete size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
