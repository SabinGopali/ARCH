import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function getImageUrl(imagePath) {
  if (!imagePath) return "/logo.webp";
  let url = String(imagePath).replace(/\\/g, "/");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("/")) url = url.slice(1);
    url = `http://localhost:3000/${url}`;
  }
  return url;
}

export default function Checkout() {
  const { state } = useLocation();
  const {
    selectedProducts = [],
    rawTotalPrice = 0,
    couponDiscount = 0,
    totalPrice: passedTotal = 0,
  } = state || {};

  const computedTotal = useMemo(() => {
    if (selectedProducts.length > 0) {
      const sum = selectedProducts.reduce((s, p) => s + Number(p.price || 0) * Number(p.qty || 0), 0);
      return Math.max(0, sum - Number(couponDiscount || 0));
    }
    return Math.max(0, Number(passedTotal || 0));
  }, [selectedProducts, couponDiscount, passedTotal]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    mapUrl: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-10 text-black max-w-7xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-10 text-center uppercase">Check<span className="text-red-500">out</span></h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="lg:w-2/3 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-6">Shipping Address</h3>
            <form className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.address}
                onChange={handleChange}
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-3"
                  value={form.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Street"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-3"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
              

              {/* Map URL Field */}
              <input
                type="url"
                name="mapUrl"
                placeholder="Google Map Embed URL"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.mapUrl}
                onChange={handleChange}
              />
              
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-6">Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span className="text-sm font-medium">
                  Credit / Debit Card
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
                <span className="text-sm font-medium">Digital Wallet</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>

              {paymentMethod === "card" && (
                <div className="space-y-5 mt-4">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    className="w-full border border-gray-300 rounded-md px-4 py-3"
                    value={form.cardNumber}
                    onChange={handleChange}
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      className="flex-1 border border-gray-300 rounded-md px-4 py-3"
                      value={form.expiry}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      className="w-24 border border-gray-300 rounded-md px-4 py-3"
                      value={form.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-[35%] space-y-8">
          <div className="border rounded-xl p-6 bg-white shadow-lg">
            <h3 className="font-semibold mb-5 text-xl">Order Summary</h3>
            <div className="space-y-5 max-h-80 overflow-y-auto pr-2">
              {selectedProducts.length === 0 ? (
                <p className="text-sm text-gray-500">No items selected. <Link to="/cart" className="underline">Go back to cart</Link>.</p>
              ) : (
                selectedProducts.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {Number(item.qty || 0)} × Rs. {Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      Rs. {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <hr className="my-5" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{selectedProducts.length} item(s)</span>
                <span>Rs. {Number(rawTotalPrice || 0).toFixed(2)}</span>
              </div>
              {Number(couponDiscount || 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon discount</span>
                  <span>-Rs. {Number(couponDiscount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>Rs. {computedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-lg text-base font-semibold hover:bg-gray-800 transition">
            Place Order →
          </button>
        </div>
      </div>
    </div>
  );
}