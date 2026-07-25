import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyATMde9ExB0aVCf0vSHMI3__euu2XHWWss',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'chainiq-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'chainiq-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'chainiq-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '534945169918',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:534945169918:web:a2fc3a407a07533092c0af',
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication Instance & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});
