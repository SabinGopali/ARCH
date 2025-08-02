import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Supplierinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [suppliers, setSuppliers] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  // For password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

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

  const handleApproveDelete = async (id) => {
    if (!window.confirm("Are you sure you want to approve deletion of this supplier?")) return;
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

  // New: Handle rejection of deletion request
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
        // Remove from pendingDeletes only, supplier remains
        setPendingDeletes((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to reject deletion request.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Open password modal on delete button click
  const openDeleteModal = (userId) => {
    setDeleteTargetId(userId);
    setPassword("");
    setDeleteError("");
    setShowPasswordModal(true);
  };

  // Confirm delete with password
  const confirmDelete = async () => {
    if (!password) {
      setDeleteError("Password is required.");
      return;
    }
    try {
      const res = await fetch(`/backend/user/delete/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully.");
        setSuppliers((prev) => prev.filter((u) => u._id !== deleteTargetId));
        setPendingDeletes((prev) => prev.filter((u) => u._id !== deleteTargetId));
        setShowPasswordModal(false);
      } else {
        setDeleteError(data.message || "Failed to delete user.");
      }
    } catch (error) {
      setDeleteError(error.message);
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
                          onClick={() => handleApproveDelete(user._id)}
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
                          onClick={() => openDeleteModal(user._id)}
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

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-md shadow p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-2">Please enter your password to confirm deletion.</p>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {deleteError && <p className="text-red-600 mb-3">{deleteError}</p>}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
