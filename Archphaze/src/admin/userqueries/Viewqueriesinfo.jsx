import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function Viewqueriesinfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const res = await fetch(`/backend/form/viewform/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch form data");

        setClient(data.form); // Access the nested form from backend response
      } catch (err) {
        setError(err.message);
        console.error("Error fetching form:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFormData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Query Details</h2>
          <form className="space-y-6">
            <Input label="Full Name" value={client?.fullname} />
            <Input label="Email" value={client?.email} />
            <Input label="Phone" value={client?.phone} />
            <Input label="Existing Website" value={client?.exisiting_website || "N/A"} />
            <Input label="Selected Service" value={client?.service_select} />
            <Textarea label="Description" value={client?.description} />
            <Input label="User Ref ID" value={client?.userRef} />
            <Input label="User Mail" value={client?.userMail} />
            <Input label="Submitted On" value={client?.createdAt ? new Date(client.createdAt).toLocaleString() : ""} />
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow-md"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Input({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        disabled
        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
      />
    </div>
  );
}

function Textarea({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={4}
        value={value || ""}
        disabled
        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 resize-none"
      />
    </div>
  );
}
