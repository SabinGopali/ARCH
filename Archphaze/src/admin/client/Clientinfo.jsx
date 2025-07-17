import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Clientinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/backend/client/getclient");
        const data = await res.json();

        if (res.ok && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          console.error("Unexpected response:", data);
          setClients([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchClients();
    }
  }, [currentUser?._id]);

  // Handle delete
  const handleDelete = async (client) => {
    if (window.confirm(`Are you sure you want to delete "${client.company_name}"?`)) {
      try {
        const res = await fetch(`/backend/client/deleteclient/${client._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (res.ok) {
          setClients((prev) => prev.filter((c) => c._id !== client._id));
          alert(`${client.company_name} deleted successfully!`);
        } else {
          console.error(data.message || "Failed to delete the client.");
          alert(data.message || "Failed to delete the client.");
        }
      } catch (error) {
        console.error(error.message);
        alert("An error occurred while deleting the client.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <p>Loading clients...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Speaker List</h2>
            <Link to="/addspeakerinfo">
              <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm">
                + Add Speaker Details
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Client Image</th>
                  <th className="py-2 px-4">Company Name</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Posted By</th>
                  <th className="py-2 px-4">Created Date</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clients.map((client, index) => (
                    <tr key={client._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <img
                              src={`http://localhost:3000/${client.client_image}`}
                              alt={`${client.company_name} logo`}
                              className="w-16 h-16 object-contain rounded border"
                            />
                      </td>
                      <td className="py-3 px-4 font-medium">{client.company_name}</td>
                      <td className="py-3 px-4 text-gray-700">{client.description}</td>
                      <td className="py-3 px-4 text-gray-700">{client.userMail}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {client.createdAt
                          ? new Date(client.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Link to={`/updateclientinfo/${client._id}`}>
                          <button
                            title="Edit"
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                          >
                            <MdEdit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(client)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
