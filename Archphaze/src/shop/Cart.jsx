import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { updateQty, removeFromCart, addToCart } from "../redux/cartSlice"; // fixed import name
import { Link } from "react-router-dom";

function getImageUrl(imagePath) {
  if (!imagePath) return "https://via.placeholder.com/96";
  let url = imagePath.replace(/\\/g, "/");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("/")) url = url.slice(1);
    url = `http://localhost:3000/${url}`;
  }
  return url;
}

export default function ShoppingCart() {
  const products = useSelector((state) => {
    const cartsByUser = state.cart?.cartsByUser || {};
    const currentUserId = state.cart?.currentUserId;
    return cartsByUser?.[currentUserId] || [];
  });

  const currentUserId = useSelector((state) => state.cart?.currentUserId);
  const currentUser = useSelector((state) => state.user?.currentUser);

  const dispatch = useDispatch();

  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const couponDiscountValue = 2.5;

  const toggleSelection = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateQuantity = (index, delta) => {
    const product = products[index];
    if (!product) return;

    const currentQty = Number(product.qty);
    if (isNaN(currentQty)) return;

    const newQty = Math.max(1, currentQty + delta);
    dispatch(updateQty({ productId: product.productId, qty: newQty }));

    // Auto-select item when qty changes
    setSelectedIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const removeProduct = (index) => {
    const product = products[index];
    if (!product) return;

    dispatch(removeFromCart(product.productId));
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const selectedProducts = products.filter((_, i) => selectedIndexes.includes(i));

  let rawTotalPrice = 0;
  for (const item of selectedProducts) {
    const price = Number(item.price);
    const qty = Number(item.qty);
    if (isNaN(price) || isNaN(qty)) continue;
    rawTotalPrice += price * qty;
  }

  const couponDiscount =
    selectedProducts.length > 0 && rawTotalPrice > couponDiscountValue
      ? couponDiscountValue
      : 0;

  const totalPrice = Math.max(0, rawTotalPrice - couponDiscount);

  // Function to add sample products for testing
  const addSampleProducts = () => {
    const sampleProducts = [
      {
        productId: 'sample1',
        name: 'Cute worm baby toys',
        price: 45.2,
        qty: 1,
        image: '/logo.webp'
      },
      {
        productId: 'sample2',
        name: 'Cute crab baby toys',
        price: 35.5,
        qty: 1,
        image: '/logo.webp'
      }
    ];

    sampleProducts.forEach(product => {
      dispatch(addToCart(product));
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-8 text-black max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Cart</h2>

      {/* Show authentication and cart status */}
      <div className="mb-6 space-y-2">
        <div className="text-sm text-gray-600">
          {currentUser ? (
            <span className="text-green-600">✓ Signed in as: {currentUser.username || currentUser.email}</span>
          ) : (
            <span className="text-orange-600">⚠ Please sign in to use the cart</span>
          )}
        </div>
        
        {products.length === 0 && currentUserId ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-3">Your cart is empty. Would you like to add some sample items for testing?</p>
            <div className="flex gap-2">
              <button 
                onClick={addSampleProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Sample Products
              </button>
              <Link 
                to="/productdetail/1"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                View Sample Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-700">
            {selectedIndexes.length} of {products.length} item
            {products.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3 space-y-6">
          {products.map((item, idx) => {
            const isSelected = selectedIndexes.includes(idx);
            const displayPrice = !isNaN(Number(item.price)) ? Number(item.price).toFixed(2) : "0.00";
            const displayQty = !isNaN(Number(item.qty)) ? Number(item.qty) : 1;
            return (
              <label
                key={item.productId}
                htmlFor={`checkbox-${idx}`}
                className={`group cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl transition relative ${
                  isSelected
                    ? "border-black bg-gray-50 shadow"
                    : "border-gray-200 bg-white hover:shadow hover:border-gray-400"
                }`}
              >
                <input
                  id={`checkbox-${idx}`}
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => toggleSelection(idx)}
                />

                <div className="flex items-center gap-5 w-full md:w-auto">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col justify-between items-end gap-4 w-full md:w-auto min-w-[120px]">
                  <div className="text-right">
                    <p className="font-semibold text-lg">${displayPrice}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded border text-xl font-bold disabled:opacity-40 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, -1);
                        }}
                        aria-label="Decrease quantity"
                        disabled={displayQty === 1}
                        type="button"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{displayQty}</span>
                      <button
                        className="w-8 h-8 rounded border text-xl font-bold transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, 1);
                        }}
                        aria-label="Increase quantity"
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProduct(idx);
                      }}
                      aria-label="Delete"
                      type="button"
                      className="text-gray-600 hover:text-red-600 transition"
                    >
                      <MdDelete size={22} />
                    </button>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="w-full md:w-1/3 space-y-8">
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <h4 className="font-semibold mb-5 text-lg">Price Details</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>
                  {selectedProducts.length} item
                  {selectedProducts.length !== 1 ? "s" : ""}
                </span>
                <span>${rawTotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Coupon discount</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">Free Delivery</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link to="/checkout">
            <button
              className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-black"
              type="button"
            >
              Place order →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
