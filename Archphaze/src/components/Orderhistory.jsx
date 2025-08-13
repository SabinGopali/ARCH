import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function OrderHistory() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        let data;
        try {
          const res = await fetch("http://localhost:3000/backend/order/user/me", { credentials: "include" });
          data = await res.json();
        } catch (e) {
          data = null;
        }

        let list = Array.isArray(data?.orders) ? data.orders : [];

        // Fallback: try by-email if empty
        if ((!list || list.length === 0) && currentUser?.email) {
          const byEmailRes = await fetch(`http://localhost:3000/backend/order/user/by-email?email=${encodeURIComponent(currentUser.email)}`);
          const byEmailData = await byEmailRes.json();
          list = Array.isArray(byEmailData?.orders) ? byEmailData.orders : list;
        }

        setOrders(list || []);
      } catch (e) {
        console.error("Failed to load order history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const referenceOf = (o) => o.orderNumber || o.paymentRef || o.stripeSessionId || o.esewaPid || o._id;

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => String(referenceOf(o) || "").toLowerCase().includes(term));
  }, [orders, searchTerm]);

  function imageUrl(path) {
    if (!path) return "https://via.placeholder.com/64x64";
    let url = path.replace(/\\/g, "/");
    if (!/^https?:\/\//i.test(url)) {
      if (url.startsWith("/")) url = url.slice(1);
      url = `http://localhost:3000/${url}`;
    }
    return url;
  }

  async function handleDelete(orderId) {
    if (!orderId) return;
    if (!confirm("Delete this order from your history? This cannot be undone.")) return;
    try {
      setDeleting(orderId);
      const res = await fetch(`http://localhost:3000/backend/order/user/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete');
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold uppercase mb-6">
          Order <span className="text-red-500">History</span>
        </h1>
        <div className="text-gray-600">Please sign in to view your orders.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold uppercase mb-6">
        Order <span className="text-red-500">History</span>
      </h1>

      <div className="mb-6 flex items-center gap-3">
        <input
          type="search"
          placeholder="Search order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading…</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((o) => (
            <div key={o._id} className="border rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                <div>
                  <p className="text-sm text-gray-500">Order #{referenceOf(o)}</p>
                  <p className="text-xs text-gray-500">{(o.paymentMethod || 'card').toUpperCase()} {o.paymentProvider ? `• ${o.paymentProvider}` : ''}</p>
                  <p className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {o.status}
                  </span>
                 
                </div>
              </div>
              <div className="divide-y">
                {o.items.map((it) => (
                  <div key={it.productId} className="flex gap-4 p-4 hover:bg-gray-50 transition">
                    <img src={imageUrl(it.image)} alt={it.name} className="w-16 h-16 rounded object-cover bg-gray-100" />
                    <div className="flex flex-col flex-grow">
                      <h2 className="font-semibold text-gray-800">{it.name}</h2>
                      <div className="mt-2 flex justify-between text-sm font-medium">
                        <span>Rs. {(it.unitAmount / 100).toFixed(2)}</span>
                        <span>Qty: {it.quantity}</span>
                        <span>Subtotal: Rs. {(it.subtotal / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end px-4 py-3 text-sm">
                <span className="font-semibold">Total: Rs. {(o.totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}