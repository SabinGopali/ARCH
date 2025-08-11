import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";

export default function Adminorder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/backend/order/all", { credentials: "include" });
        let data;
        try {
          data = await res.json();
        } catch {
          // fallback public orders endpoint
          const alt = await fetch("http://localhost:3000/backend/order/all-public");
          data = await alt.json();
        }
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 space-y-8">
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-4">ORDER NO.</th>
                    <th className="py-2 px-4">DATE</th>
                    <th className="py-2 px-4">CUSTOMER</th>
                    <th className="py-2 px-4">SUPPLIER</th>
                    <th className="py-2 px-4">TOTAL (NPR)</th>
                    <th className="py-2 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{o.stripeSessionId}</td>
                      <td className="py-3 px-4">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{o.customer?.name || "-"}</div>
                        <div className="text-xs text-gray-500">{o.customer?.email || ""}</div>
                      </td>
                      <td className="py-3 px-4">{o.supplierId}</td>
                      <td className="py-3 px-4 font-semibold">{(o.totalAmount / 100).toFixed(2)}</td>
                      <td className="py-3 px-4">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
