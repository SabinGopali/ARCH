import React, { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar";
import { useSelector } from "react-redux";

export default function Order() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
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
        console.warn("No supplierId found, skipping fetch.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/backend/order/supplier/${supplierId}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          console.warn("Unexpected response format from API");
        }
      } catch (e) {
        console.error("Failed to load orders", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierId]);

  const allStatuses = ["All", "pending", "paid", "fulfilled", "canceled"];
  const paymentFilters = [
    { label: "All", value: "All" },
    { label: "Card", value: "card" },
    { label: "eSewa", value: "wallet_esewa" },
    { label: "COD", value: "cod" },
  ];

  const referenceOf = (o) =>
    o.orderNumber || o.paymentRef || o.stripeSessionId || o.esewaPid || o._id;

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders
      .filter((o) => {
        if (!term) return true;
        const nameMatches = (o.customer?.name || "").toLowerCase().includes(term);
        const refMatches = String(referenceOf(o) || "").toLowerCase().includes(term);
        return nameMatches || refMatches;
      })
      .filter((o) => {
        if (selectedStatus === "All") return true;
        return String(o.status || "").toLowerCase() === selectedStatus.toLowerCase();
      })
      .filter((o) => {
        if (selectedPayment === "All") return true;
        return String(o.paymentMethod || "card") === selectedPayment;
      });
  }, [orders, search, selectedStatus, selectedPayment]);

  // ---------------- Image Helper ----------------
  function imageUrl(path) {
    if (!path) return "https://via.placeholder.com/40x40";

    // Already a full URL
    if (/^https?:\/\//i.test(path)) return path;

    // Normalize Windows paths
    let normalized = path.replace(/\\/g, "/");
    if (normalized.startsWith("/")) normalized = normalized.slice(1);

    // Backend base URL (change if needed)
    const backendBaseUrl = "http://localhost:3000"; // match your backend port
    return `${backendBaseUrl}/${normalized}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="lg:flex lg:gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 mb-10 lg:mb-0">
            <Suppliersidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-0 md:p-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-semibold mb-2">Orders</h1>
              <p className="text-gray-500 mb-6">
                Manage your customers' orders and logistics.
              </p>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all duration-150 ${
                        selectedStatus === status
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {status === "All"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Payment filter */}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-gray-500">Payment:</span>
                  <select
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  >
                    {paymentFilters.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4 max-w-sm">
                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-white">
                  <FiSearch className="text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by customer or order #..."
                    className="w-full outline-none text-sm"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm text-left">
                  <thead className="text-gray-600 border-b">
                    <tr>
                      <th className="py-2 px-3">ORDER NO.</th>
                      <th className="py-2 px-3">DATE</th>
                      <th className="py-2 px-3">CUSTOMER</th>
                      <th className="py-2 px-3">ITEMS</th>
                      <th className="py-2 px-3">PAYMENT</th>
                      <th className="py-2 px-3">TOTAL (NPR)</th>
                      <th className="py-2 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="py-6 px-3" colSpan={7}>
                          Loading…
                        </td>
                      </tr>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map((o) => (
                        <tr key={o._id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <div className="font-medium">{referenceOf(o)}</div>
                            <div className="text-xs text-gray-500">{o._id}</div>
                          </td>
                          <td className="py-2 px-3">
                            {new Date(o.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-medium">{o.customer?.name || "-"}</div>
                            <div className="text-xs text-gray-500">
                              {o.customer?.email || ""}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            {o.items.map((it) => (
                              <div
                                key={it.productId}
                                className="text-xs flex items-center gap-2 py-0.5"
                              >
                                <img
                                  src={imageUrl(it.image)}
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://via.placeholder.com/40x40")
                                  }
                                  alt={it.name}
                                  className="w-10 h-10 rounded object-cover bg-gray-100"
                                />
                                <span>
                                  {it.name} × {it.quantity}
                                </span>
                              </div>
                            ))}
                          </td>
                          <td className="py-2 px-3">
                            <div className="text-xs font-medium uppercase">
                              {o.paymentMethod || "card"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {o.paymentProvider || ""}
                            </div>
                          </td>
                          <td className="py-2 px-3 font-semibold">
                            {(o.totalAmount / 100).toFixed(2)}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                o.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : o.status === "canceled"
                                  ? "bg-red-100 text-red-700"
                                  : o.status === "fulfilled"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-6 px-3" colSpan={7}>
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
