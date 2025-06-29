import React, { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalPrice = cart.reduce((sum, item) => {
    // Extract numeric price for calculation (assuming "Rs.1178.00" format)
    const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + numericPrice * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen p-6 bg-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cart.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 border p-4 rounded shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p>
                    Color: <span className="capitalize">{item.color}</span>, Size:{" "}
                    {item.size}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="text-right font-bold text-xl mb-6">
            Total: Rs.{totalPrice.toFixed(2)}
          </div>

          <button
            onClick={clearCart}
            className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
