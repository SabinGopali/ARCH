import React, { useState } from "react";
import Sidebar from "../../../Sidebar";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Speakerinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Static placeholder data
  const [clients, setClients] = useState([
    {
      _id: "1",
      company_name: "Phaze Arch",
      description:
        "Simple but cool. A blend of streetwear and minimalism. This piece combines bold color choices with clean lines for everyday confident wear.",
      client_image: "uploads/archphaze.webp",
      userMail: "admin@example.com",
      createdAt: "2024-07-01T12:00:00Z",
      price: 1178,
    },
    {
      _id: "2",
      company_name: "Urban Beats",
      description:
        "Perfect for music lovers. Minimal design with bold accents. Stand out with sound and style.",
      client_image: "uploads/urbanbeats.jpg",
      userMail: "user@example.com",
      createdAt: "2024-07-05T10:15:00Z",
      price: 1499,
    },
  ]);

  const handleDelete = (client) => {
    if (window.confirm(`Are you sure you want to delete "${client.company_name}"?`)) {
      setClients((prev) => prev.filter((c) => c._id !== client._id));
      alert(`${client.company_name} deleted successfully!`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Product List</h2>
            <Link to="/addspeakerinfo">
              <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm">
                + Add Product
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Product Image</th>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Available Sizes</th>
                  <th className="py-2 px-4">Available Colors</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  clients.map((client, index) => (
                    <tr key={client._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <img
                          src={`http://localhost:3000/${client.client_image}`}
                          alt={client.company_name}
                          className="w-16 h-16 object-contain rounded border"
                        />
                      </td>
                      <td className="py-3 px-4 font-semibold">{client.company_name}</td>
                      <td className="py-3 px-4 font-medium text-black">
                        Rs.{client.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{client.description}</td>
                      <td className="py-3 px-4">
                        {["XS", "S", "M", "L", "XL"].map((size) => (
                          <span
                            key={size}
                            className="inline-block text-xs border px-2 py-1 mr-1 mb-1 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 px-4">
                        {["bg-red-600", "bg-white", "bg-cyan-400"].map((colorClass, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded-full inline-block border-2 mr-2 ${
                              colorClass === "bg-white"
                                ? "border-black"
                                : "border-transparent"
                            } ${colorClass}`}
                          ></span>
                        ))}
                      </td>
                      <td className="py-3 px-4 flex flex-col gap-2">
                        <Link to={`/updateclientinfo/${client._id}`}>
                          <button
                            title="Edit"
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                          >
                            <MdEdit size={18} />
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(client)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                          Delete
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
