import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Supplierinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/backend/user/getusers", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          // Only include users who are suppliers
          const supplierList = data.users.filter((user) => user.isSupplier);
          setSuppliers(supplierList);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchSuppliers();
    }
  }, [currentUser]);

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirm) return;

    try {
      const res = await fetch(`/backend/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setSuppliers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
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
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Supplier List</h2>
          {suppliers.length === 0 ? (
            <p className="text-gray-600">No suppliers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Company Name</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Phone</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Business Types</th> {/* Added column */}
                    <th className="py-2 px-4">Created Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((user, index) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{user.username || "No Name"}</td>
                      <td className="py-3 px-4">{user.company_name || "-"}</td>
                      <td className="py-3 px-4">{user.company_location || "-"}</td>
                      <td className="py-3 px-4">{user.phone || "-"}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <a href={`mailto:${user.email}`} className="hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {(user.businessTypes && user.businessTypes.length > 0)
                          ? user.businessTypes.join(", ")
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
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
