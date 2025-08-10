import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Supplierinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [suppliers, setSuppliers] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/backend/user/getusers", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          const supplierList = data.users.filter((user) => user.isSupplier);
          setSuppliers(supplierList);
          setPendingDeletes(supplierList.filter((u) => u.deletionRequested));
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser?.isAdmin) fetchSuppliers();
  }, [currentUser]);

  // Direct delete (no password)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`/backend/user/admin-delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully.");
        setSuppliers((prev) => prev.filter((u) => u._id !== id));
        setPendingDeletes((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Reject deletion request
  const handleRejectDelete = async (id) => {
    if (!window.confirm("Are you sure you want to reject the deletion request for this supplier?")) return;
    try {
      const res = await fetch(`/backend/user/admin-reject-deletion/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Deletion request rejected.");
        setPendingDeletes((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to reject deletion request.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const formatDate = (iso) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(iso).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        
        {/* Pending Deletion Requests */}
        <div className="bg-white rounded-md shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Supplier Deletion Requests</h2>
          {pendingDeletes.length === 0 ? (
            <p>No pending deletion requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Reason</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDeletes.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-3 px-4 font-medium">{user.username}</td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${user.email}`} className="hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="py-3 px-4">{user.deletionReason || "No reason provided"}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={18} /> Approve Delete
                        </button>
                        <button
                          onClick={() => handleRejectDelete(user._id)}
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded px-2"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Suppliers */}
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-semibold mb-4">All Suppliers</h2>
          {suppliers.length === 0 ? (
            <p>No suppliers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Company Name</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Phone</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Business Types</th>
                    <th className="py-2 px-4">Created At</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((user, index) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{user.username}</td>
                      <td className="py-3 px-4">{user.company_name || "-"}</td>
                      <td className="py-3 px-4">{user.company_location || "-"}</td>
                      <td className="py-3 px-4">{user.phone || "-"}</td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${user.email}`} className="hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {user.businessTypes && user.businessTypes.length > 0
                          ? user.businessTypes.join(", ")
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={18} /> Delete
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
