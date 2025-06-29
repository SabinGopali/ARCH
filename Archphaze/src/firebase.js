// src/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "archphaze.firebaseapp.com",
  projectId: "archphaze",
  storageBucket: "archphaze.firebasestorage.app",
  messagingSenderId: "500861352716",
  appId: "1:500861352716:web:f62883ceb5c687775ee729",
  measurementId: "G-YZQL5YWVKH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

