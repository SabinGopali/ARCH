import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdVisibility } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Companies() {
  const { currentUser } = useSelector((state) => state.user);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/backend/store/admin/all", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCompanies(data.storeProfiles || []);
        } else {
          setCompanies([]);
        }
      } catch (e) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) fetchCompanies();
  }, [currentUser?.isAdmin]);

  const [viewing, setViewing] = useState(null);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this company's store profile?")) return;
    try {
      const res = await fetch(`/backend/store/admin/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c.userId?._id !== userId));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (e) {
      alert("Request failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Company Store Profiles</h2>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Company</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Opening Hours</th>
                    <th className="py-2 px-4">Logo</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No companies found.
                      </td>
                    </tr>
                  ) : (
                    companies.map((c, index) => (
                      <tr key={c._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold">{c.userId?.company_name || "-"}</div>
                            <div className="text-gray-500 text-xs">{c.userId?.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{c.city || "-"}, {c.street || "-"}</td>
                        <td className="py-3 px-4 text-gray-700 max-w-md truncate">{c.companyDescription || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="text-xs space-y-1 max-w-xs">
                            {(c.openingHours || []).slice(0, 3).map((oh, i) => (
                              <div key={i}>{oh.day}: {oh.enabled ? `${oh.open} - ${oh.close}` : "Closed"}</div>
                            ))}
                            {(c.openingHours || []).length > 3 && <div>…</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {c.logo ? (
                            <img src={`http://localhost:3000/${c.logo}`} alt="logo" className="w-12 h-12 object-contain border rounded" />
                          ) : (
                            <span className="text-gray-400">No logo</span>
                          )}
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button title="View" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <MdVisibility size={18} />
                          </button>
                          <button onClick={() => handleDelete(c.userId?._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1" title="Delete">
                            <MdDelete size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}