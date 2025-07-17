import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import logo from "/logo.webp";

const productsData = [
  {
    name: "Cute worm baby toys",
    desc: "Perfect plush worm toy for infants",
    size: "One Size",
    color: "Multi",
    price: 45.2,
    originalPrice: 50,
    qty: 1,
    image: logo,
  },
  {
    name: "Cute crab baby toys",
    desc: "Soft crab plush with embroidered details",
    size: "One Size",
    color: "Red",
    price: 45.2,
    originalPrice: 50,
    qty: 1,
    image: logo,
  },
  {
    name: "Plush toys for babies",
    desc: "Adorable cuddly plush toy safe for babies",
    size: "One Size",
    color: "Blue",
    price: 45.2,
    originalPrice: 50,
    qty: 1,
    image: logo,
  },
  {
    name: "Cute snail baby toys",
    desc: "Snail plush toy with soft fabric",
    size: "One Size",
    color: "Yellow",
    price: 16.2,
    originalPrice: 20,
    qty: 1,
    image: logo,
  },
];

export default function ShoppingCart() {
  const [products, setProducts] = useState(productsData);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const couponDiscount = 2.5;

  const toggleSelection = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const updateQty = (index, delta) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };

  const removeItem = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const selectedProducts = products.filter((_, i) => selectedIndexes.includes(i));
  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-8 text-black">
      <h2 className="text-3xl font-semibold mb-6">Cart</h2>


      

      {/* Selected Items Summary */}
      <div className="mb-4 text-sm font-medium text-gray-700">
        {selectedIndexes.length} of {products.length} items selected
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Cards */}
        <div className="w-full md:w-2/3 space-y-6">
          {products.map((item, idx) => {
            const isSelected = selectedIndexes.includes(idx);
            return (
              <label
                key={idx}
                htmlFor={`checkbox-${idx}`}
                className={`group cursor-pointer flex justify-between items-center p-4 border rounded-xl transition relative ${
                  isSelected
                    ? "border-black bg-gray-50 shadow"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Hidden Checkbox */}
                <input
                  id={`checkbox-${idx}`}
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => toggleSelection(idx)}
                />

                {/* Left: Image and Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">
                      {item.desc}
                    </p>
                    <div className="text-sm text-gray-700 flex gap-4">
                      <span>
                        Size <span className="font-medium">{item.size}</span>
                      </span>
                      <span>
                        Color <span className="font-medium">{item.color}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price, Qty Controls & Actions */}
                <div className="text-right flex flex-col justify-between h-full">
                  <div>
                    <p className="font-semibold text-lg">${item.price}</p>
                    <p className="text-sm text-gray-400 line-through">
                      ${item.originalPrice}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded border text-xl font-bold disabled:opacity-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(idx, -1);
                        }}
                        aria-label="Decrease quantity"
                        disabled={item.qty === 1}
                      >
                        −
                      </button>
                      <span className="text-sm font-medium">{item.qty}</span>
                      <button
                        className="w-8 h-8 rounded border text-xl font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(idx, 1);
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex gap-3 text-gray-600">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
                        aria-label="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
                      
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Gifting */}
          <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Buying for a loved one?</p>
              <span className="text-purple-600 text-xl">🎁</span>
            </div>
            <p className="text-sm text-gray-600">
              Send personalized message at $20
            </p>
            <button className="text-sm text-blue-600 hover:underline mt-2">
              Add gift wrap
            </button>
          </div>

          {/* Price Details */}
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h4 className="font-semibold mb-3">Price Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {selectedProducts.length} item
                  {selectedProducts.length !== 1 ? "s" : ""}
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Coupon discount</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free Delivery</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>${(totalPrice - couponDiscount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Place order →
          </button>
        </div>
      </div>
    </div>
  );
}
