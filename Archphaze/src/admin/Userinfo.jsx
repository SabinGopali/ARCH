import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Userinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/backend/user/getusers", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    let requestBody = {};

    // If NOT admin, prompt for password
    if (!currentUser?.isAdmin) {
      const password = window.prompt("Please enter your password to confirm deletion:");
      if (!password) {
        alert("Password is required to delete your account.");
        return;
      }
      requestBody.password = password;
    }

    try {
      const res = await fetch(`/backend/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: currentUser?.isAdmin ? null : JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert("User deleted successfully.");
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const formatDate = (iso) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(iso).toLocaleDateString(undefined, options);
  };

  const getUserRole = (user) => {
    if (user.isAdmin) return "Admin";
    if (user.isSupplier) return "Supplier";
    return "User";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email Address</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Created Date</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{user.username || "No Name"}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <a href={`mailto:${user.email}`} className="hover:underline">
                        {user.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{getUserRole(user)}</td>
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
        </div>
      </main>
    </div>
  );
}
