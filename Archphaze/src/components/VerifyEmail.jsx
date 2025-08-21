import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      setStatus('Missing email.');
    }
  }, [email]);

  const onVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) return setStatus('Enter the code you received.');
    try {
      setLoading(true);
      setStatus('');
      const res = await fetch('/backend/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Verification failed');
      } else {
        setStatus('Email verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (err) {
      setStatus('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    try {
      setLoading(true);
      setStatus('');
      const res = await fetch('/backend/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Could not resend code');
      } else {
        setStatus('New code sent to your email.');
      }
    } catch (err) {
      setStatus('Could not resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Verify your email</h2>
        <p className="text-sm text-gray-600">We sent a 6-digit code to {email || 'your email'}.</p>
        <form onSubmit={onVerify} className="space-y-3">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center"
          />
          <button disabled={loading} className="w-full py-3 bg-black text-white rounded-lg">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <button onClick={onResend} disabled={loading} className="text-blue-600 text-sm">
          Resend code
        </button>
        {status && (
          <div className="text-sm text-center text-gray-700">{status}</div>
        )}
      </div>
    </div>
  );
}

