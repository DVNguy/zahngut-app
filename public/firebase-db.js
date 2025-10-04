import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBci-nWGvx7OdMb6BmWbS8pWBR9Leidl_Q",
  authDomain: "zahngut-app.firebaseapp.com",
  databaseURL: "https://zahngut-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zahngut-app",
  storageBucket: "zahngut-app.firebasestorage.app",
  messagingSenderId: "1022498780184",
  appId: "1:1022498780184:web:922e819956feb594037f6d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
