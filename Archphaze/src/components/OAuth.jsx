// src/components/OAuth.jsx
import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userslice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth({ endpoint: endpointProp, extraBody }) {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const isSupplierSignup = location.pathname.toLowerCase().includes('supplier');
      const endpoint = endpointProp || (isSupplierSignup ? '/backend/auth/google-supplier' : '/backend/auth/google');

      const extra = typeof extraBody === 'function' ? extraBody() : (extraBody || {});

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, ...extra }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        console.error("Server error:", data.message);
        alert(data.message || 'Google sign-in failed');
      }

    } catch (error) {
      console.error("Google login failed:", error);
      alert(error?.message || 'Google sign-in failed');
    }
  };

  return (
    <div>
     

      <button
        onClick={handleGoogleClick}
        className="flex items-center justify-center gap-3 w-full border border-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all text-sm sm:text-base font-medium shadow-sm"
      >
        <FaGoogle className="text-red-500 text-xl" />
        Continue with Google
      </button>
    </div>
  );
}
