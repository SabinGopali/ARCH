import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function FailureEsewa() {
  const [params] = useSearchParams();
  const pid = params.get('transaction_uuid') || params.get('pid');

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">eSewa Payment Failed</h1>
      <p className="text-gray-700">Your eSewa payment was not completed.</p>
      {pid && <p className="text-xs text-gray-500 mt-2">Transaction: {pid}</p>}
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/cart" className="inline-block text-white bg-black px-4 py-2 rounded">Back to Cart</Link>
        <Link to="/checkout" className="inline-block text-black border border-black px-4 py-2 rounded">Try Again</Link>
      </div>
    </div>
  );
}