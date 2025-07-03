import React from "react";
import { FaArrowUp, FaUsers } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineWork } from "react-icons/md";
import { AiOutlineSmile } from "react-icons/ai";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar";

const stats = [
  {
    label: "Total Users",
    value: 12600,
    change: "+2%",
    icon: <FaUsers className="text-blue-600" />,
  },
  {
    label: "Career Submissions",
    value: 1186,
    change: "+15%",
    icon: <MdOutlineWork className="text-green-600" />,
  },
  {
    label: "New Registrations",
    value: 22,
    change: "+2%",
    icon: <FiUserPlus className="text-purple-600" />,
  },
  {
    label: "User Satisfaction",
    value: "89.9%",
    change: "+5%",
    icon: <AiOutlineSmile className="text-yellow-500" />,
  },
];

const barData = [
  { date: "1 June", Career: 50, Services: 60, Shop: 45 },
  { date: "2 June", Career: 45, Services: 55, Shop: 48 },
  { date: "3 June", Career: 52, Services: 59, Shop: 50 },
  { date: "4 June", Career: 70, Services: 75, Shop: 60 },
  { date: "5 June", Career: 35, Services: 45, Shop: 40 },
  { date: "6 June", Career: 58, Services: 65, Shop: 49 },
  { date: "7 June", Career: 50, Services: 55, Shop: 47 },
];

const attendanceData = [
  { name: "Present", value: 12562, color: "#6366f1" },
  { name: "On Leave", value: 10, color: "#facc15" },
  { name: "On Holiday", value: 25, color: "#34d399" },
  { name: "Absent", value: 4, color: "#f87171" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-64 w-full">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm text-gray-600 mb-6">Overview of users, career info, services, and shop</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h4 className="text-base font-medium text-gray-700">{item.label}</h4>
                  <p className="text-xl font-semibold text-gray-900">{item.value}</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <FaArrowUp /> {item.change} from last quarter
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Service & Shop Performance (Weekly)</h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="Career" fill="#6366f1" name="Career Info" />
                  <Bar dataKey="Services" fill="#10b981" name="Arch Services" />
                  <Bar dataKey="Shop" fill="#f59e0b" name="Shop Management" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">User Attendance (4 June 2024)</h2>
            <div className="flex flex-col items-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="mt-4 w-full max-w-xs space-y-2">
                {attendanceData.map((entry, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">{entry.name}</span>
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
