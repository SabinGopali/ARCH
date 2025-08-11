import React, { useEffect, useState } from "react";
import { FaArrowUp, FaUsers } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineWork } from "react-icons/md";
import { AiOutlineSmile } from "react-icons/ai";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, careerRes, serviceRes, productRes, ordersRes] = await Promise.all([
          fetch("/backend/user/getusers", { credentials: "include" }),
          fetch("/backend/career/getCareer"),
          fetch("/backend/services/getservice"),
          fetch("/backend/product/getall"),
          fetch("/backend/order/all", { credentials: "include" }),
        ]);

        const [userData, careerData, serviceData, products, ordersData] = await Promise.all([
          userRes.json(),
          careerRes.json(),
          serviceRes.json(),
          productRes.json(),
          ordersRes.json(),
        ]);

        const totalUsers = userData?.totalUsers ?? 0;
        const lastMonthUsers = userData?.lastMonthUsers ?? 0;

        const totalCareers = careerData?.totalCareers ?? 0;
        const lastMonthCareers = careerData?.lastMonthCareers ?? 0;

        const totalServices = serviceData?.totalservices ?? 0;
        const lastMonthServices = serviceData?.lastMonthservices ?? 0;

        const productArray = Array.isArray(products) ? products : [];
        const totalProducts = productArray.length;

        const ordersArray = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
        setRecentOrders(ordersArray.slice(0, 10));

        const now = new Date();
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthProducts = productArray.filter(
          (p) => new Date(p.createdAt) >= oneMonthAgo
        ).length;

        setStats([
          {
            label: "Total Users",
            value: totalUsers,
            change: `+${lastMonthUsers} this month`,
            icon: <FaUsers className="text-blue-600" />,
          },
          {
            label: "Career Records",
            value: totalCareers,
            change: `+${lastMonthCareers} this month`,
            icon: <MdOutlineWork className="text-green-600" />,
          },
          {
            label: "Total Services",
            value: totalServices,
            change: `+${lastMonthServices} this month`,
            icon: <FiUserPlus className="text-purple-600" />,
          },
          {
            label: "Total Products",
            value: totalProducts,
            change: `+${lastMonthProducts} this month`,
            icon: <AiOutlineSmile className="text-yellow-500" />,
          },
        ]);

        // Prepare 7-day bar data (Career/Services/Shop per day)
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
        });

        const formatKey = (d) => d.toISOString().slice(0, 10);
        const formatLabel = (d) =>
          d.toLocaleDateString(undefined, { day: "numeric", month: "short" });

        const countByDay = (arr) => {
          const map = {};
          (arr || []).forEach((item) => {
            const t = new Date(item.createdAt);
            const key = formatKey(t);
            map[key] = (map[key] || 0) + 1;
          });
          return map;
        };

        const careerCounts = countByDay(careerData?.careers);
        const serviceCounts = countByDay(serviceData?.services);
        const productCounts = countByDay(productArray);

        const weekly = days.map((d) => {
          const key = formatKey(d);
          return {
            date: formatLabel(d),
            Career: careerCounts[key] || 0,
            Services: serviceCounts[key] || 0,
            Shop: productCounts[key] || 0,
          };
        });
        setBarData(weekly);

        // Pie breakdown across main entities
        const pie = [
          { name: "Users", value: totalUsers, color: "#6366f1" },
          { name: "Careers", value: totalCareers, color: "#10b981" },
          { name: "Services", value: totalServices, color: "#f59e0b" },
          { name: "Products", value: totalProducts, color: "#f87171" },
        ];
        setBreakdownData(pie);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="md:w-64 w-full">
          <Sidebar />
        </div>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm text-gray-600 mb-6">Loading live metrics…</p>
        </main>
      </div>
    );
  }

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
                    <FaArrowUp /> {item.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Service & Shop Performance (Last 7 Days)</h2>
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
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Data Breakdown</h2>
            <div className="flex flex-col items-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="mt-4 w-full max-w-xs space-y-2">
                {breakdownData.map((entry, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">{entry.name}</span>
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2 px-3">ORDER NO.</th>
                  <th className="py-2 px-3">DATE</th>
                  <th className="py-2 px-3">CUSTOMER</th>
                  <th className="py-2 px-3">SUPPLIER</th>
                  <th className="py-2 px-3">TOTAL (NPR)</th>
                  <th className="py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td className="py-6 px-3" colSpan={6}>No orders yet.</td></tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{o.stripeSessionId}</td>
                      <td className="py-2 px-3">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <div className="font-medium">{o.customer?.name || '-'}</div>
                        <div className="text-xs text-gray-500">{o.customer?.email || ''}</div>
                      </td>
                      <td className="py-2 px-3">{o.supplierId}</td>
                      <td className="py-2 px-3 font-semibold">{(o.totalAmount / 100).toFixed(2)}</td>
                      <td className="py-2 px-3">{o.status}</td>
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
