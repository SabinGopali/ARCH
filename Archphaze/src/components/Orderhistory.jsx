import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const sampleOrders = [
  {
    orderNumber: "54stg47851sa963",
    date: "May 25, 2024",
    status: "Waiting for delivery",
    products: [
      {
        name: "Red Bali Kratom Capsules (Size 00 or 000)",
        description: [
          "Capsule size 00 (500mg-600mg per capsule)",
          "Contains pure Red Bali Kratom powder",
        ],
        price: "$24.99",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1603398938378-803f1e8385c9?w=400&q=80",
      },
    ],
  },
  {
    orderNumber: "89ghk47851ab251",
    date: "July 10, 2024",
    status: "Delivered",
    products: [
      {
        name: "P9 Wireless Stereo Headphones",
        description: [
          "Bluetooth 5.0",
          "Up to 20 hours playtime",
          "Noise cancellation",
        ],
        price: "$59.99",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
      },
    ],
  },
];

export default function OrderHistory() {
  const [orders, setOrders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (orderNumber) => {
    setOrders((prev) => prev.filter((order) => order.orderNumber !== orderNumber));
  };

  // Filter orders by search term (order number)
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold uppercase mb-6">
        Order <span className="text-red-500">History</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.orderNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border rounded-xl shadow-sm bg-white"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-400">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleDelete(order.orderNumber)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>

                {/* Product List */}
                <div className="divide-y">
                  {order.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 hover:bg-gray-50 transition"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex flex-col flex-grow">
                        <h2 className="font-semibold text-gray-800">{product.name}</h2>
                        <ul className="text-sm text-gray-500 list-disc pl-5">
                          {product.description.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                        <div className="mt-2 flex justify-between text-sm font-medium">
                          <span>{product.price}</span>
                          <span>Qty: {product.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
