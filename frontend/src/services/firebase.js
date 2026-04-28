import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCL1Fc4KulJBiiXRnFOzjPG3yHxUifYxLs",
  authDomain: "volunteeriq-2026-demo.firebaseapp.com",
  projectId: "volunteeriq-2026-demo",
  storageBucket: "volunteeriq-2026-demo.firebasestorage.app",
  messagingSenderId: "491392878690",
  appId: "1:491392878690:web:845bac86e539a5441ee93b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export default app;
