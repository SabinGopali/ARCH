import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Teamsinfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Backend base URL
  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/backend/team/getteam");
        const data = await res.json();

        if (res.ok && Array.isArray(data.teams)) {
          setTeams(data.teams);
        } else {
          console.error("Unexpected response:", data);
          setTeams([]);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchTeams();
    }
  }, [currentUser?._id]);

  const handleDelete = async (team) => {
    if (window.confirm(`Delete "${team.Username}"?`)) {
      try {
        const res = await fetch(`/backend/team/deleteteam/${team._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok) {
          setTeams((prev) => prev.filter((t) => t._id !== team._id));
          alert(`${team.Username} deleted successfully!`);
        } else {
          console.error(data.message || "Failed to delete.");
          alert(data.message || "Failed to delete.");
        }
      } catch (error) {
        console.error(error.message);
        alert("An error occurred while deleting.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <p>Loading team data...</p>
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
            <h2 className="text-lg font-semibold">Team List</h2>
            <Link to="/addteamsinfo">
              <button className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white text-sm">
                + Add Team Member
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">S.No.</th>
                  <th className="py-2 px-4">Image</th>
                  <th className="py-2 px-4">Username</th>
                  <th className="py-2 px-4">Post</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Facebook</th>
                  <th className="py-2 px-4">LinkedIn</th>
                  <th className="py-2 px-4">Created At</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-gray-500">
                      No team members found.
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr key={team._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <img
                          src={`${backendURL}/${team.t_image}`}
                          alt={team.Username}
                          className="w-16 h-16 object-cover rounded border"
                          onError={(e) => (e.target.src = "/default-avatar.png")}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{team.Username}</td>
                      <td className="py-3 px-4">{team.t_post}</td>
                      <td className="py-3 px-4">{team.t_description}</td>
                      <td className="py-3 px-4">
                        <a href={team.t_fblink} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                          Facebook
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <a href={team.t_lnlink} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                          LinkedIn
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {team.createdAt
                          ? new Date(team.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Link to={`/updateteamsinfo/${team._id}`}>
                          <button
                            title="Edit"
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                          >
                            <MdEdit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(team)}
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
