import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState('idle'); // idle | confirming | confirmed | error
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function confirm() {
      if (!sessionId) return;
      try {
        setStatus('confirming');
        const res = await fetch('http://localhost:3000/backend/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        if (!res.ok || data?.error) throw new Error(data?.error || 'Failed to confirm payment');
        if (!cancelled) setStatus('confirmed');
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setError(e.message || 'Failed to finalize order.');
        }
      }
    }
    confirm();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700">Thank you! Your payment was completed.</p>
      {sessionId && (
        <p className="text-xs text-gray-500 mt-2">Session: {sessionId}</p>
      )}
      {status === 'confirming' && (
        <p className="text-sm text-gray-500 mt-3">Finalizing your order…</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/orderhistory" className="inline-block text-white bg-black px-4 py-2 rounded">View Order History</Link>
        <Link to="/" className="inline-block text-black border border-black px-4 py-2 rounded">Go Home</Link>
      </div>
    </div>
  );
}