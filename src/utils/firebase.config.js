// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWYjS9PP99alVgFLLSsXivC-K1r3jn3-U",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "import-export-hub-6d3de.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "import-export-hub-6d3de",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "import-export-hub-6d3de.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "506579946093",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:506579946093:web:d7573ef6875530a3970d64",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H0Z6V3QPVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
