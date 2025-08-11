import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700">Thank you! Your payment was completed.</p>
      {sessionId && (
        <p className="text-xs text-gray-500 mt-2">Session: {sessionId}</p>
      )}
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/orderhistory" className="inline-block text-white bg-black px-4 py-2 rounded">View Order History</Link>
        <Link to="/" className="inline-block text-black border border-black px-4 py-2 rounded">Go Home</Link>
      </div>
    </div>
  );
}