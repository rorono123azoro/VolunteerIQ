import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyByE5jhuKakZQbhFd2Us99lnz_zZ16_czw",
  authDomain: "volunteeriq-app-2026.firebaseapp.com",
  projectId: "volunteeriq-app-2026",
  storageBucket: "volunteeriq-app-2026.firebasestorage.app",
  messagingSenderId: "460960561993",
  appId: "1:460960561993:web:06cf670ad3b68b8b577898"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export default app;
