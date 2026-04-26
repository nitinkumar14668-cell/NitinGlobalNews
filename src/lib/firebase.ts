import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCzj8OFQkA_1f6dTIfrl7_bYBP5TD7qxiU",
  authDomain: "nitinglobalnews.firebaseapp.com",
  projectId: "nitinglobalnews",
  storageBucket: "nitinglobalnews.firebasestorage.app",
  messagingSenderId: "725848136001",
  appId: "1:725848136001:web:d92a3c0f252f73fa51e9c0",
  measurementId: "G-09TM8HRVX7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
