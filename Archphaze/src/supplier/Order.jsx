import React, { useState } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar";

const orders = [
  {
    id: 1,
    customer: "Theresa Webb",
    location: "Recology, San Mateo",
    orderNo: "227772827762342",
    date: "25th Jan. 2024",
    Quantity: "5 hours",
    workers: ["🧑‍🔧", "👷"],
    vehicles: ["🚚", "🚗"],
    bill: "$1450",
    status: "Completed orders",
  },
  {
    id: 2,
    customer: "John Doe",
    location: "Eco Services, LA",
    orderNo: "123456789012345",
    date: "10th Feb. 2024",
    Quantity: "3 hours",
    workers: ["👷"],
    vehicles: ["🚗"],
    bill: "$950",
    status: "Active orders",
  },
  {
    id: 3,
    customer: "Alice Smith",
    location: "GreenWorks, NY",
    orderNo: "998877665544332",
    date: "5th Mar. 2024",
    Quantity: "7 hours",
    workers: ["🧑‍🔧"],
    vehicles: ["🚚"],
    bill: "$1800",
    status: "Requested orders",
  },
  {
    id: 4,
    customer: "Michael Johnson",
    location: "BuildCo, TX",
    orderNo: "443322110099887",
    date: "15th Mar. 2024",
    Quantity: "6 hours",
    workers: ["👷", "🧑‍🔧"],
    vehicles: ["🚗", "🚚"],
    bill: "$1600",
    status: "Waiting for Assign",
  },
  {
    id: 5,
    customer: "Emma Williams",
    location: "UrbanFix, FL",
    orderNo: "556677889900112",
    date: "20th Mar. 2024",
    Quantity: "4 hours",
    workers: ["🧑‍🔧"],
    vehicles: ["🚚"],
    bill: "$1200",
    status: "Ready to deploy",
  },
];

export default function Order() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Completed orders");

  const filteredOrders = orders
    .filter((order) =>
      order.customer.toLowerCase().includes(search.toLowerCase())
    )
    .filter((order) => order.status === selectedStatus);

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
                  ({orders.filter((order) => order.status === tab).length})
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
                  <th className="py-2 px-3">
                    <input type="checkbox" />
                  </th>
                  <th className="py-2 px-3">CUSTOMER NAME</th>
                  <th className="py-2 px-3">ORDER NO.</th>
                  <th className="py-2 px-3">DATE</th>
                  <th className="py-2 px-3">QUANTITY</th>
                  <th className="py-2 px-3">ACTIONS</th>
                  <th className="py-2 px-3">TOTAL BILL</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <input type="checkbox" />
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.location}</div>
                    </td>
                    <td className="py-2 px-3">{order.orderNo}</td>
                    <td className="py-2 px-3">{order.date}</td>
                    <td className="py-2 px-3">{order.Quantity}</td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {order.workers.map((w, i) => (
                          <span key={i}>{w}</span>
                        ))}
                        {order.vehicles.map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 font-semibold">{order.bill}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Orders Found */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-6 text-gray-500">No orders found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
