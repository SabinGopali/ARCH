import React, { useState } from "react";
import logo from "/logo.webp";

const selectedProducts = [
  {
    name: "Cute worm baby toys",
    qty: 2,
    price: 45.2,
    image: logo,
  },
  {
    name: "Cute snail baby toys",
    qty: 1,
    price: 16.2,
    image: logo,
  },
];

const couponDiscount = 2.5;
const totalPrice = selectedProducts.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-12 text-black max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-8">Checkout</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Shipping & Payment */}
        <div className="md:w-2/3 space-y-10">
          {/* Shipping Address */}
          <section>
            <h3 className="text-2xl font-semibold mb-6">Shipping Address</h3>
            <form className="space-y-5 max-w-xl">
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
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.postalCode}
                onChange={handleChange}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                value={form.country}
                onChange={handleChange}
              />
            </form>
          </section>

          {/* Payment Method */}
          <section>
            <h3 className="text-2xl font-semibold mb-6">Payment Method</h3>
            <div className="space-y-4 max-w-xl">
              {/* Payment method selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="text-sm font-medium">Credit / Debit Card</span>
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
              </div>

              {/* Show card inputs only if card is selected */}
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
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-[38%] space-y-8">
          <div className="border rounded-xl p-6 bg-white shadow-md">
            <h3 className="font-semibold mb-5 text-xl">Order Summary</h3>
            <div className="space-y-5 max-h-80 overflow-y-auto pr-2">
              {selectedProducts.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.qty} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-5" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{selectedProducts.length} item(s)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Coupon discount</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>${(totalPrice - couponDiscount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-lg text-base font-semibold hover:opacity-90 transition">
            Place Order →
          </button>
        </div>
      </div>
    </div>
  );
}
