import React from "react";

const products = [
  {
    name: "Apple AirPods",
    color: "Grey Space",
    price: 100.5,
    qty: 2,
    image: "/airpods.webp",
  },
  {
    name: "Apple iPhone 12",
    color: "Pacific Blue",
    price: 450,
    qty: 3,
    image: "/iphone12.webp",
  },
  {
    name: "Apple iPad Pro",
    color: "Pink Gold",
    price: 445,
    qty: 2,
    image: "/ipadpro.webp",
  },
];

export default function ShoppingCart() {
  const subtotal = products.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = subtotal * 0.15;
  const shipping = 7.99;
  const tax = 0.07 * (subtotal - discount);
  const total = (subtotal - discount + shipping + tax).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-16 text-gray-900">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-2">
        Main / <span className="text-gray-700">Shopping Cart</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-10">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-8">
          {products.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between border-b pb-6">
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover bg-white shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  defaultValue={item.qty}
                  className="border px-3 py-1 rounded-md bg-white shadow-sm text-sm"
                >
                  {[1, 2, 3, 4].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <p className="text-md font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                <button className="text-gray-400 hover:text-red-500 text-xl">&times;</button>
              </div>
            </div>
          ))}

          <button className="text-sm px-5 py-2 border rounded-md hover:bg-gray-100 transition w-fit">
            ← Continue Shopping
          </button>
        </div>

        {/* Summary Section */}
        <div className="border rounded-xl p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount (15%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <div className="mt-4">
            <button className="text-sm text-blue-600 hover:underline">
              Apply Discount Code
            </button>
          </div>

          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
