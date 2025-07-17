import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Partnersinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/backend/Partners/getPartner");
        const data = await res.json();

        if (res.ok && Array.isArray(data.partners)) {
          setCompanies(data.partners);
        } else {
          console.error("Unexpected response:", data);
          setCompanies([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchPartners();
    }
  }, [currentUser?._id]);

  const handleEdit = (company) => alert(`Editing ${company.c_name}`);

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.c_name}?`)) {
      try {
        const res = await fetch(`/backend/Partners/deletePartner/${company._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (res.ok) {
          setCompanies((prev) => prev.filter((c) => c._id !== company._id));
          alert(`${company.c_name} deleted successfully!`);
        } else {
          console.log(data.message || "Failed to delete the company.");
          alert(data.message || "Failed to delete the company.");
        }
      } catch (error) {
        console.log(error.message);
        alert("An error occurred while deleting the company.");
      }
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

          {loading ? (
            <p>Loading companies...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 px-4">S.No.</th>
                    <th className="py-2 px-4">Company Logo</th>
                    <th className="py-2 px-4">Company Name</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Posted By</th>
                    <th className="py-2 px-4">Created Date</th>
                    <th className="py-2 px-4">URL</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, index) => (
                    <tr key={company._id || index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <img
                          src={company.c_logo}
                          alt={`${company.c_name} logo`}
                          className="w-16 h-16 object-contain rounded"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{company.c_name}</td>
                      <td className="py-3 px-4 text-gray-700">{company.c_description}</td>
                      <td className="py-3 px-4 text-gray-700">{company.userMail}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {company.createdAt
                          ? new Date(company.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-blue-600 underline">
                        <a href={company.c_link} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        
                        <Link to={`/updatepartnersinfo/${company._id}`}>
                          <button
                            onClick={() => handleEdit(company)}
                            title="Edit"
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                          >
                            <MdEdit size={18} />
                          </button>
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          title="Delete"
                          onClick={() => handleDelete(company)}
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
