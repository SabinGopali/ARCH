import React, { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import AssetSidebar from "./AssetSidebar";

export default function AssetDashboard() {
  const [timeFilter, setTimeFilter] = useState("Week");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stats data
  const stats = [
    { label: "Assets", value: 8456, bg: "bg-red-100", text: "text-red-600" },
    { label: "Brands", value: 567, bg: "bg-gray-100", text: "text-gray-600" },
    { label: "Work Orders", value: 234, bg: "bg-orange-100", text: "text-orange-600" },
    { label: "Vendors", value: 4788, bg: "bg-yellow-100", text: "text-yellow-600" },
  ];

  // Vendors list
  const vendors = [
    { name: "Anthony", status: "Active", img: "https://i.pravatar.cc/40?u=1" },
    { name: "Mark", status: "Active", img: "https://i.pravatar.cc/40?u=2" },
    { name: "Joshua", status: "Inactive", img: "https://i.pravatar.cc/40?u=3" },
    { name: "Ronald", status: "Inactive", img: "https://i.pravatar.cc/40?u=4" },
  ];

  // Alerts
  const alerts = [
    { title: "Monitor is not Working", desc: "Issue in printing section" },
    { title: "Asset is not Working", desc: "Issue in IT section" },
  ];

  // Maintenance log
  const maintenanceLogs = [
    { asset: "Printer X1", date: "2024-08-20", assignee: "John Doe", status: "Pending" },
    { asset: "Laptop HP", date: "2024-08-18", assignee: "Jane Smith", status: "Completed" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:block">
        <AssetSidebar isOpen={true} />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-red-500">OCTA</h1>
          <button onClick={() => setSidebarOpen((v) => !v)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Instance */}
      <div className="md:hidden">
        <AssetSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 w-full md:ml-0 md:pl-0 pt-20 md:pt-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Asset Management</p>
              <h1 className="text-xl font-bold">Welcome Sera,</h1>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assets, vendors, logs..."
                  className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Notifications & User */}
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 cursor-pointer text-gray-600" />
              <img
                src="https://i.pravatar.cc/40?u=sera"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="font-semibold">Overview</h2>
            <div className="flex gap-3">
              {["Week", "Month", "Year"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`text-sm px-3 py-1 rounded-md ${
                    timeFilter === t ? "bg-red-500 text-white" : "text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl flex flex-col items-center justify-center ${s.bg}`}
              >
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-gray-600 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GRID ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ALERTS */}
          <div className="bg-white p-4 rounded-2xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Alerts</h3>
              <button className="text-xs text-red-500">View all</button>
            </div>
            {alerts.map((a, i) => (
              <div
                key={i}
                className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100"
              >
                <p className="font-medium text-red-600 text-sm">{a.title}</p>
                <p className="text-xs text-gray-500">{a.desc}</p>
                <button className="text-xs mt-2 text-gray-400">Close</button>
              </div>
            ))}
          </div>

          {/* ASSET VALUE */}
          <div className="bg-white p-4 rounded-2xl shadow-sm w-full md:col-span-2">
            <h3 className="font-semibold mb-4">Asset Value</h3>
            <div className="h-56 flex items-center justify-center text-gray-400 border rounded-xl">
              📈 Chart Placeholder (use Recharts/Chart.js)
            </div>
          </div>
        </div>

        {/* GRID ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VENDORS */}
          <div className="bg-white p-4 rounded-2xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Vendors</h3>
              <button className="text-xs text-red-500">View all</button>
            </div>
            {vendors.map((v, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img src={v.img} alt={v.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm">{v.name}</span>
                </div>
                <span
                  className={`text-xs ${
                    v.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>

          {/* MAINTENANCE LOG */}
          <div className="bg-white p-4 rounded-2xl shadow-sm w-full md:col-span-2 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Maintenance Log</h3>
              <button className="text-xs text-red-500">View all</button>
            </div>
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="p-2 text-left">Asset</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Assignee</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceLogs.map((log, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{log.asset}</td>
                    <td className="p-2">{log.date}</td>
                    <td className="p-2">{log.assignee}</td>
                    <td
                      className={`p-2 ${
                        log.status === "Completed" ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {log.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
