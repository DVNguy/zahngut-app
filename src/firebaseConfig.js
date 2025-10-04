import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBci-nWGvx7OdMb6BmWbS8pWBR9Leidl_Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zahngut-app.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://zahngut-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zahngut-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zahngut-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1022498780184",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1022498780184:web:922e819956feb594037f6d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log('✅ Firebase initialized');
