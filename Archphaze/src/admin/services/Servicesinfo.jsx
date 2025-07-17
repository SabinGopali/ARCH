import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Servicesinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchservices = async () => {
      try {
        const res = await fetch("/backend/services/getservice");
        const data = await res.json();

        if (res.ok && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error("Unexpected response:", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchservices();
    }
  }, [currentUser?._id]);

  const handleAddService = () => {
    navigate("/addservicesinfo");
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.s_title}"?`)) {
      try {
        const res = await fetch(`/backend/services/deleteservice/${service._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok) {
          setServices((prev) => prev.filter((s) => s._id !== service._id));
          alert(`${service.s_title} deleted successfully!`);
        } else {
          console.log(data.message || "Failed to delete the service.");
          alert(data.message || "Failed to delete the service.");
        }
      } catch (error) {
        console.log(error.message);
        alert("An error occurred while deleting the service.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-10">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Services List</h2>
            <button
              onClick={handleAddService}
              className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm"
            >
              + Add Service Info
            </button>
          </div>

          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Video</th>
                    <th className="py-2 px-4">Posted By</th>
                    <th className="py-2 px-4">Created Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{service.s_title}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {service.s_description}
                      </td>
                      <td className="py-3 px-4">
                        <video
                           src={`http://localhost:3000/${service.s_link}`}
                          controls
                          className="w-32 h-20 rounded shadow-sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-700">{service.userMail}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {service.createdAt
                          ? new Date(service.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="py-3 px-4 space-x-2 flex items-center">
                        
                        <Link to={`/updateservicesinfo/${service._id}`}>
                          <button
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Edit Service"
                          >
                            <MdEdit size={18} />
                          </button>
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete Service"
                          onClick={() => handleDelete(service)}
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
