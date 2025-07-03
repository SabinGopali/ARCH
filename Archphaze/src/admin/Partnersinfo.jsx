import React from "react";
import Sidebar from "./Sidebar";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Link } from "react-router-dom";

const companies = [
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
    name: "Tech Solutions",
    description: "Innovative tech company delivering software solutions.",
    url: "https://techsolutions.example.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    name: "Google",
    description: "Global leader in internet-related services and products.",
    url: "https://www.google.com",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    name: "Apple Inc.",
    description: "Designs and manufactures consumer electronics and software.",
    url: "https://www.apple.com",
  },
];

export default function Partnersinfo() {
  const handleView = (company) => alert(`Viewing details for ${company.name}`);
  const handleEdit = (company) => alert(`Editing ${company.name}`);
  const handleDelete = (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      alert(`${company.name} deleted!`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Company List</h2>
            <Link to="/addpartnersinfo">
              <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm">
                + Add Company Details
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Company Logo</th>
                  <th className="py-2 px-4">Company Name</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">URL</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-16 h-16 object-contain rounded"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{company.name}</td>
                    <td className="py-3 px-4 text-gray-700">{company.description}</td>
                    <td className="py-3 px-4 text-blue-600 underline">
                      <a href={company.url} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleView(company)}
                        title="View"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(company)}
                        title="Edit"
                        className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(company)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
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
