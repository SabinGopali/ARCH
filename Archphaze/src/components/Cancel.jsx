import React from 'react';

export default function Cancel() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Canceled</h1>
      <p className="text-gray-700">Your payment was canceled. You can retry checkout anytime.</p>
    </div>
  );
}