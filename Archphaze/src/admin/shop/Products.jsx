import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { MdDelete, MdEdit } from "react-icons/md";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/backend/product/getall");
        const data = await res.json();
        if (res.ok) {
          setProducts(Array.isArray(data) ? data : []);
        } else {
          setProducts([]);
        }
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
    } catch (e) {
      alert("Request failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Products</h2>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
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
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-4 text-center text-gray-500">No products found.</td>
                    </tr>
                  ) : (
                    products.map((p, index) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {p.images?.[0] ? (
                            <img src={`http://localhost:3000/${p.images[0]}`} alt={p.productName} className="w-12 h-12 object-contain border rounded" />
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
                          <button className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1" title="Edit">
                            <MdEdit size={18} />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1" title="Delete">
                            <MdDelete size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}