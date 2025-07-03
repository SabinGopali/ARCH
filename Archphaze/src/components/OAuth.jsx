// src/components/OAuth.jsx
import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userslice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to backend
      const res = await fetch('/backend/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        console.error("Server error:", data.message);
      }

    } catch (error) {
      console.error("Google login failed:", error);
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
