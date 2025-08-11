import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar";
import { useSelector } from "react-redux";

export default function Order() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Completed orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state) => state.user?.currentUser);

  const supplierId = useMemo(() => {
    if (currentUser?.isSubUser) {
      return (
        currentUser?.supplierId ||
        currentUser?.supplierRef ||
        localStorage.getItem("supplierId") ||
        ""
      );
    }
    return (
      currentUser?._id ||
      currentUser?.id ||
      localStorage.getItem("supplierId") ||
      ""
    );
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!supplierId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/backend/order/supplier/${supplierId}`);
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [supplierId]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => (o.customer?.name || '').toLowerCase().includes(search.toLowerCase()))
      .filter((o) => (selectedStatus === 'Completed orders' ? o.status === 'paid' : true));
  }, [orders, search, selectedStatus]);

  const allStatuses = [
    "Active orders",
    "Requested orders",
    "Waiting for Assign",
    "Ready to deploy",
    "Completed orders",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row relative">
      {/* Mobile Toggle */}
      <button
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-white rounded-full shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-2">Orders</h1>
          <p className="text-gray-500 mb-6">
            Manage your customers' completed product orders and logistics.
          </p>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {allStatuses.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all duration-150 ${
                  selectedStatus === tab
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
                <span className="ml-1 text-xs text-gray-500">
                  ({filteredOrders.length})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4 max-w-sm">
            <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-white">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer name..."
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2 px-3">ORDER NO.</th>
                  <th className="py-2 px-3">DATE</th>
                  <th className="py-2 px-3">CUSTOMER</th>
                  <th className="py-2 px-3">ITEMS</th>
                  <th className="py-2 px-3">TOTAL (NPR)</th>
                  <th className="py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 px-3" colSpan={6}>Loading…</td></tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{o.stripeSessionId}</td>
                      <td className="py-2 px-3">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <div className="font-medium">{o.customer?.name || '-'}</div>
                        <div className="text-xs text-gray-500">{o.customer?.email || ''}</div>
                      </td>
                      <td className="py-2 px-3">
                        {o.items.map((it) => (
                          <div key={it.productId} className="text-xs">
                            {it.name} × {it.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-3 font-semibold">{(o.totalAmount / 100).toFixed(2)}</td>
                      <td className="py-2 px-3">{o.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="py-6 px-3" colSpan={6}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
