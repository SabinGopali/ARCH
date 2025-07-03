import React from "react";
import Sidebar from "./Sidebar";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"; // for navigation

const services = [
  {
    title: "Web Development",
    description: "Creating responsive and scalable websites.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Mobile App Development",
    description: "Building cross-platform mobile applications.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "UI/UX Design",
    description: "Designing modern and user-friendly interfaces.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Video Editing",
    description: "Crafting engaging video content with effects and transitions.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "SEO Optimization",
    description: "Improving website visibility and rankings in search engines.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export default function Servicesinfo() {
  const navigate = useNavigate();

  const handleAddService = () => {
    navigate("/addservicesinfo"); // or open a modal if preferred
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-10">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Services List</h2>
            
            <button onClick={handleAddService}
              className="bg-white text-black border border-black px-4 py-2 rounded
               hover:bg-black hover:text-white text-sm">
              + Add Service Info
            </button>

          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Video</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{service.title}</td>
                    <td className="py-3 px-4 text-gray-700">{service.description}</td>
                    <td className="py-3 px-4">
                      <video
                        src={service.video}
                        controls
                        className="w-32 h-20 rounded shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4 space-x-2 flex items-center">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Service"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit Service"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete Service"
                      >
                        <MdDelete size={18} />
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
