import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removePurchasedItems } from '../redux/cartSlice';

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const method = params.get('method'); // e.g., 'cod'
  const [status, setStatus] = useState('idle'); // idle | confirming | confirmed | error
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const didApplyRef = useRef(false);

  const currentUser = useSelector((s) => s.user?.currentUser);
  const cartCurrentUserId = useSelector((s) => s.cart?.currentUserId);
  const userIdForCart = currentUser?._id || currentUser?.id || cartCurrentUserId || undefined;
  const [purchasedIds, setPurchasedIds] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (method === 'cod') {
        setStatus('confirmed');
        return;
      }
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
        if (!cancelled) {
          setPurchasedIds(Array.isArray(data?.productIds) ? data.productIds : []);
          setStatus('confirmed');
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setError(e.message || 'Failed to finalize order.');
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [sessionId, method]);

  useEffect(() => {
    if (status === 'confirmed' && !didApplyRef.current && purchasedIds.length > 0) {
      didApplyRef.current = true;
      dispatch(removePurchasedItems({ userId: userIdForCart, productIds: purchasedIds }));
    }
  }, [status, dispatch, purchasedIds, userIdForCart]);

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700">Thank you! Your {method === 'cod' ? 'order has been placed.' : 'payment was completed.'}</p>
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