import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Suppliersidebar from "../supplier/Suppliersidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserManagement() {
  const [subAccounts, setSubAccounts] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  // Deny access if logged-in sub-user is inactive
  if (currentUser?.isSubUser && currentUser?.isActive === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">Your account is inactive. Please contact your supplier admin.</p>
        </div>
      </div>
    );
  }

  // Fetch sub-users from backend on mount
  useEffect(() => {
    const fetchSubUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/backend/subuser/list", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch sub-users");
        }

        const data = await res.json();

        // Map backend data to your UI structure
        const mappedData = data.map((user) => ({
          email: user.email,
          role: user.role,
          status: user.isActive ?? true,
          isOwner: false,
          id: user._id,
        }));

        setSubAccounts(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubUsers();
  }, []);

  // Toggle status locally (optional: add API call here to update status in backend)
  const handleStatusToggle = (index) => {
    const updated = [...subAccounts];
    updated[index].status = !updated[index].status;
    setSubAccounts(updated);
  };

  const resetFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setSearchEmail("");
  };

  const filteredAccounts = subAccounts.filter((user) => {
    const matchRole = roleFilter ? user.role === roleFilter : true;
    const matchStatus =
      statusFilter === ""
        ? true
        : statusFilter === "active"
        ? user.status
        : !user.status;
    const matchEmail = user.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    return matchRole && matchStatus && matchEmail;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-[20rem] xl:w-[22rem]">
            <Suppliersidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-grow w-full">
            <section className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FiUsers className="text-orange-500" />
                  Manage Sub Accounts
                </h2>
                <Link to="/adduserform">
                  <button className="border border-orange-500 text-orange-500 px-4 py-1.5 rounded hover:bg-orange-50 text-sm">
                    Add Sub Account
                  </button>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <select
                  className="border border-gray-300 px-3 py-2 rounded text-sm text-gray-700"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="Seller Supplier Access">Seller Supplier Access</option>
                  <option value="Asset Management Control">Asset Management Control</option>
                  {/* Add more roles if applicable */}
                </select>
                <select
                  className="border border-gray-300 px-3 py-2 rounded text-sm text-gray-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <input
                  type="text"
                  placeholder="Email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded text-sm w-60"
                />
              
              </div>

              {/* Loading & Error */}
              {loading && (
                <div className="text-center py-4 text-gray-600">Loading...</div>
              )}
              {error && (
                <div className="text-center py-4 text-red-500">
                  Error: {error}
                </div>
              )}

              {/* Table */}
              {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Roles</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Is Owner</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccounts.map((user, index) => (
                        <tr key={user.id || index} className="border-t">
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline">
                            {user.role}
                          </td>
                          <td className="px-4 py-3">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={user.status}
                                onChange={() => handleStatusToggle(index)}
                              />
                              <div
                                className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                                  user.status ? "bg-orange-500" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                    user.status ? "translate-x-5" : ""
                                  }`}
                                ></div>
                              </div>
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            {user.isOwner ? (
                              <FiCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <FiXCircle className="text-red-500 text-lg" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <Link to={`/updateuserform/${user.id}`}>
                                <button className="flex items-center gap-1 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                                  <FiEdit /> Modify
                                </button>
                              </Link>
                              <button className="flex items-center gap-1 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                                <FiTrash2 /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}