import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaBell, FaPlus } from "react-icons/fa";
import Suppliersidebar from "../supplier/Suppliersidebar";

export default function Supplierdashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  const [greeting, setGreeting] = useState("Good day");
  const [currentTime, setCurrentTime] = useState("");
  const [language, setLanguage] = useState("en");

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
                <StatCard title="Product Sold" value="48,951" change="+4.13%" chartColor="blue" />
                <StatCard title="Total Balance" value="43,956" change="-63.1%" chartColor="red" />
                <StatCard title="Sales Profit" value="28,971" change="+66.3%" chartColor="yellow" />
                <StatCard title="Abandoned Cart" value="1,526" change="-24.8%" chartColor="green" />
              </div>

              {/* Subscriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SubscriptionCard
                  color="yellow"
                  title="Asset Management Subscription"
                  daysLeft={84}
                  message="Manage your assets efficiently"
                  description="Track asset tools, usage, and renew or upgrade as needed."
                  buttonText="UPGRADE"
                />
                <SubscriptionCard
                  color="blue"
                  title="Shop Management Subscription"
                  daysLeft={100}
                  message="Control your store operations"
                  description="Your shop tools are active. Upgrade to unlock more features."
                  buttonText="UPGRADE"
                />
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
        <span className={`px-2 py-1 text-sm rounded ${colors[chartColor]} font-semibold`}>
          {change}
        </span>
      </div>
      <div className={`h-1.5 rounded-full mt-4 ${colors[chartColor]}`}></div>
    </div>
  );
}

function SubscriptionCard({ color, title, daysLeft, message, description, buttonText }) {
  const colorClasses = {
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      button: "bg-black text-white hover:bg-gray-800",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      button: "bg-blue-700 text-white hover:bg-blue-800",
    },
  };

  const { bg, text, button } = colorClasses[color];
  return (
    <div className={`${bg} p-6 rounded-xl shadow-md`}>
      <h3 className={`text-lg font-bold ${text} mb-2`}>{title}</h3>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {daysLeft} <span className="text-sm font-normal">/ Days Left</span>
      </h2>
      <p className="text-gray-700 font-semibold mb-2">{message}</p>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className={`${button} px-5 py-2 rounded-lg transition`}>
        {buttonText}
      </button>
    </div>
  );
}