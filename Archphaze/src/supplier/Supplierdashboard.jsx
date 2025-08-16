import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaBell, FaPlus } from "react-icons/fa";
import Suppliersidebar from "../supplier/Suppliersidebar";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Supplierdashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState("");
  const [language, setLanguage] = useState("en");
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalItemsSold: 0,
    totalRevenue: 0,
    paidOrders: 0,
    pendingOrders: 0,
  });
  const [chartData, setChartData] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
    if (!currentUser || !(currentUser.isSupplier || currentUser.isSubUser)) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const getGreeting = (hour, lang) => {
    const greetings = {
      en: {
        morning: "Good morning",
        afternoon: "Good afternoon",
        evening: "Good evening",
        day: "Good day",
      },
      np: {
        morning: "शुभ प्रभात",
        afternoon: "शुभ अपराह्न",
        evening: "शुभ साँझ",
        day: "शुभ दिन",
      },
    };

    if (hour < 12) return greetings[lang].morning;
    if (hour < 17) return greetings[lang].afternoon;
    return greetings[lang].evening;
  };

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      setGreeting(getGreeting(hour, language));
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTimeAndGreeting();
    const intervalId = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(intervalId);
  }, [language]);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!currentUser || !(currentUser._id || currentUser.id)) return;
      const userId = currentUser._id || currentUser.id;

      try {
        const endpoint = currentUser.isSupplier ? `/backend/user/${userId}` : `/backend/user/me`;
        const response = await fetch(endpoint, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSupplierData(data);
      } catch (error) {
        // handle error silently or with UI feedback
      }
    };

    fetchSupplierData();
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!supplierId) return;
      try {
        const res = await fetch(`http://localhost:3000/backend/order/supplier/${supplierId}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        setOrders(list);
      } catch (e) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [supplierId]);

  useEffect(() => {
    const paidStatuses = new Set(["paid", "fulfilled"]);
    let totalItems = 0;
    let revenuePaisa = 0;
    let paid = 0;
    let pending = 0;

    orders.forEach((o) => {
      if (String(o.status || "").toLowerCase() === "pending") pending += 1;
      if (paidStatuses.has(String(o.status || "").toLowerCase())) {
        paid += 1;
        revenuePaisa += Number(o.totalAmount || 0);
        if (Array.isArray(o.items)) {
          o.items.forEach((it) => {
            totalItems += Number(it.quantity || 0);
          });
        }
      }
    });

    setMetrics({
      totalItemsSold: totalItems,
      totalRevenue: revenuePaisa / 100,
      paidOrders: paid,
      pendingOrders: pending,
    });

    // Build last 7 days revenue series
    const days = 7;
    const today = new Date();
    const labels = [];
    const sums = new Array(days).fill(0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(
        d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      );
    }

    orders.forEach((o) => {
      if (!paidStatuses.has(String(o.status || "").toLowerCase())) return;
      const created = new Date(o.createdAt);

      for (let idx = 0; idx < days; idx++) {
        const start = new Date();
        start.setDate(today.getDate() - (days - 1 - idx));
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        if (created >= start && created < end) {
          sums[idx] += Number(o.totalAmount || 0) / 100;
          break;
        }
      }
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Revenue (NPR)",
          data: sums,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    });
  }, [orders]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: {
          callback: (value) => {
            try { return Number(value).toLocaleString(); } catch { return value; }
          },
        },
      },
    },
  }), []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "np" : "en"));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="lg:flex lg:gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 mb-10 lg:mb-0">
            <Suppliersidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-9 flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {greeting} {supplierData?.username || currentUser?.username || "Supplier"}{" "}
                    <span className="text-sm text-gray-500">({currentTime})</span>
                  </h1>
                  <p className="text-sm text-gray-500">Let's make your day productive</p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="px-3 py-1 rounded-md border border-gray-400 bg-white hover:bg-gray-100 transition text-gray-700 font-medium"
                    title={`Switch to ${language === "en" ? "नेपाली" : "English"}`}
                  >
                    {language === "en" ? "English" : "नेपाली"}
                  </button>

                  <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-200 transition">
                    <FaPlus /> Add New
                  </button>
                  <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Products Sold" value={metrics.totalItemsSold.toLocaleString()} chartColor="blue" />
                <StatCard title="Total Revenue (NPR)" value={metrics.totalRevenue.toLocaleString()} chartColor="green" />
                <StatCard title="Paid Orders" value={metrics.paidOrders.toLocaleString()} chartColor="yellow" />
                <StatCard title="Pending Orders" value={metrics.pendingOrders.toLocaleString()} chartColor="red" />
              </div>

              {/* Sales Chart */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Sales (Last 7 Days)</h3>
                  {chartData ? (
                    <Line data={chartData} options={chartOptions} height={100} />
                  ) : (
                    <div className="text-sm text-gray-500">No sales data yet.</div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, chartColor }) {
  const colors = {
    blue: "text-blue-500 bg-blue-100",
    red: "text-red-500 bg-red-100",
    yellow: "text-yellow-500 bg-yellow-100",
    green: "text-green-500 bg-green-100",
  };
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {change ? (
          <span className={`px-2 py-1 text-sm rounded ${colors[chartColor]} font-semibold`}>
            {change}
          </span>
        ) : null}
      </div>
      <div className={`h-1.5 rounded-full mt-4 ${colors[chartColor]}`}></div>
    </div>
  );
}