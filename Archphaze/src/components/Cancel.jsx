import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Canceled</h1>
      <p className="text-gray-700">Your payment was canceled. You can retry checkout anytime.</p>
      <div className="mt-6 space-x-3">
        <Link to="/cart" className="text-white bg-black px-4 py-2 rounded">Back to Cart</Link>
        <Link to="/" className="text-black border border-black px-4 py-2 rounded">Home</Link>
      </div>
    </div>
  );
}