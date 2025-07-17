import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar"; // Ensure this component exists

export default function ManageProduct({ products = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      {/* Mobile Sidebar Toggle */}
      <div className="px-4 lg:hidden mb-5">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 lg:flex lg:gap-8">
        {/* Sidebar */}
        <aside className="sticky top-6 self-start hidden lg:block w-64">
          <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
              <button className="bg-white text-black border border-black hover:bg-black hover:text-white  text-sm px-5 py-2.5 rounded-md shadow">
                + Add Product
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
              {["All 1257", "Out of stock 27", "Low stock 135", "Expected 12", "Returned 7"].map(
                (text, idx) => (
                  <button
                    key={idx}
                    className="bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition"
                  >
                    {text}
                  </button>
                )
              )}
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                  <tr>
                    <th className="px-4 py-3">
                      <input type="checkbox" />
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">Product Name</th>
                    <th className="px-4 py-3">Seller SKU</th>
                    <th className="px-4 py-3">Barcode</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Availability</th>
                    <th className="px-4 py-3">Backorder</th>
                    <th className="px-4 py-3">Warehouse</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-6 text-gray-400">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition text-sm">
                        <td className="px-4 py-4">
                          <input type="checkbox" checked={item.checked} readOnly />
                        </td>
                        <td className="px-4 py-4 flex items-center gap-3 min-w-[180px]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded object-cover border"
                          />
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </td>
                        <td className="px-4 py-4">{item.sku}</td>
                        <td className="px-4 py-4">{item.barcode}</td>
                        <td className="px-4 py-4">{item.onHand}</td>
                        <td className="px-4 py-4">{item.available}</td>
                        <td className="px-4 py-4">{item.backorder}</td>
                        <td className="px-4 py-4">
                          <img
                            src={item.flag}
                            alt="flag"
                            className="w-6 h-4 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <FiMoreVertical className="text-gray-500" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 pt-4 text-sm text-gray-500 text-right">
              Showing 1–{products?.length || 0} of {products?.length || 0}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
