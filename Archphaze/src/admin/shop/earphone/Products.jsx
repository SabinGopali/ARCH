import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Sidebar";
import { MdDelete } from "react-icons/md";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search state

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, usersRes] = await Promise.all([
          fetch("/backend/product/getall", { credentials: "include" }),
          fetch("/backend/user/getusers", { credentials: "include" }),
        ]);

        const prodData = await prodRes.json();
        const usersData = await usersRes.json();

        setProducts(Array.isArray(prodData) ? prodData : []);
        setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      } catch (_e) {
        setProducts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const userIdToInfo = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      map.set(String(u._id), {
        companyName: u.company_name || u.username || "Unknown Company",
        email: u.email,
      });
    });
    return map;
  }, [users]);

  const grouped = useMemo(() => {
    const groups = new Map();
    products.forEach((p) => {
      const key = String(p.userRef || "unknown");
      const info = userIdToInfo.get(key) || { companyName: "Unknown Company", email: "" };
      if (!groups.has(key)) {
        groups.set(key, { userId: key, companyName: info.companyName, email: info.email, items: [] });
      }
      groups.get(key).items.push(p);
    });

    return Array.from(groups.values()).sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [products, userIdToInfo]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/backend/product/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (_e) {
      alert("Request failed");
    }
  };

  // ✅ Fixed URL function
  const toUrl = (pathStr) => {
    if (!pathStr) return "";
    let u = String(pathStr).replace(/\\/g, "/");

    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `http://localhost:3000${u}`;
    return `http://localhost:3000/${u}`;
  };

  // 🔍 Filter groups by search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return grouped;
    return grouped.filter((g) =>
      g.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [grouped, searchTerm]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h2 className="text-lg font-semibold">All Products by Company</h2>
            {/* 🔍 Search bar */}
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-72 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {loading ? <p className="mt-2 text-gray-500">Loading...</p> : null}
        </div>

        {!loading && filteredGroups.length === 0 && (
          <div className="bg-white rounded-md shadow p-6">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}

        {!loading &&
          filteredGroups.map((group) => (
            <section key={group.userId} className="bg-white rounded-md shadow p-6">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {group.companyName}
                </h3>
                {group.email && (
                  <p className="text-xs text-gray-500">{group.email}</p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm border">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-600 border-b">
                      <th className="py-2 px-4">S.No.</th>
                      <th className="py-2 px-4">Image</th>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Brand</th>
                      <th className="py-2 px-4">Price</th>
                      <th className="py-2 px-4">Stock</th>
                      <th className="py-2 px-4">Available</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((p, index) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {p.images?.[0] ? (
                            <img
                              src={toUrl(p.images[0])}
                              alt="Product"
                              className="w-12 h-12 object-contain border rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">{p.productName}</td>
                        <td className="py-3 px-4">{p.category}</td>
                        <td className="py-3 px-4">{p.brand}</td>
                        <td className="py-3 px-4">Rs.{Number(p.price).toFixed(2)}</td>
                        <td className="py-3 px-4">{p.stock}</td>
                        <td className="py-3 px-4">{p.available ? "Yes" : "No"}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            title="Delete"
                          >
                            <MdDelete size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}
