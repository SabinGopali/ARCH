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
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.postalCode.trim()) return "Street is required";
    if (form.mapUrl && !/^https?:\/\//i.test(form.mapUrl)) return "Map URL must be a valid URL";
    if (selectedProducts.length === 0) return "No items selected";
    if (paymentMethod !== "card") return "Only card payments are supported at the moment";
    return "";
  };

  const handlePlaceOrder = async () => {
    setError("");
    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    const products = selectedProducts.map((item) => ({
      name: String(item.name || "").trim(),
      price: Number(item.price || 0),
      qty: Number(item.qty || 0),
      productId: String(item.productId || "").trim(),
    }));

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/backend/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response from payment server");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="Google Map Embed URL (optional)"
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
                  Credit / Debit Card (via Stripe Checkout)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                  disabled
                />
                <span className="text-sm font-medium">Digital Wallet (coming soon)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  disabled
                />
                <span className="text-sm font-medium">Cash on Delivery (coming soon)</span>
              </label>

              {paymentMethod === "card" && (
                <div className="mt-3 text-xs text-gray-600">
                  You will be securely redirected to Stripe Checkout to complete your payment.
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

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className={`w-full text-white py-4 rounded-lg text-base font-semibold transition ${submitting ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
          >
            {submitting ? 'Processing…' : 'Place Order →'}
          </button>
        </div>
      </div>
    </div>
  );
}