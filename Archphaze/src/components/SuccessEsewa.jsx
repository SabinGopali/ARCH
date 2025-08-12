import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SuccessEsewa() {
  const [params] = useSearchParams();
  const pid = params.get('pid');
  const refId = params.get('refId'); // eSewa sends refId on success
  const amt = params.get('amt');

  const [status, setStatus] = useState('idle'); // idle | verifying | verified | error
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!pid || !refId || !amt) return;
      try {
        setStatus('verifying');
        const res = await fetch('http://localhost:3000/backend/payment/esewa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pid, refId, amt }),
        });
        const data = await res.json();
        if (!res.ok || data?.error) throw new Error(data?.error || 'Verification failed');
        if (!cancelled) setStatus('verified');
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setError(e.message || 'Unable to verify payment');
        }
      }
    }
    verify();
    return () => { cancelled = true; };
  }, [pid, refId, amt]);

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">eSewa Payment</h1>
      {!pid || !refId || !amt ? (
        <p className="text-gray-700">Missing required parameters.</p>
      ) : status === 'verifying' ? (
        <p className="text-gray-700">Verifying your payment…</p>
      ) : status === 'verified' ? (
        <>
          <p className="text-gray-700">Payment verified and order completed.</p>
          <p className="text-xs text-gray-500 mt-2">Ref: {refId}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/orderhistory" className="inline-block text-white bg-black px-4 py-2 rounded">View Order History</Link>
            <Link to="/" className="inline-block text-black border border-black px-4 py-2 rounded">Go Home</Link>
          </div>
        </>
      ) : (
        <p className="text-red-600">{error || 'Something went wrong.'}</p>
      )}
    </div>
  );
}