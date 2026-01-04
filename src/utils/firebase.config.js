// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWYjS9PP99alVgFLLSsXivC-K1r3jn3-U",
    authDomain: "import-export-hub-6d3de.firebaseapp.com",
    projectId: "import-export-hub-6d3de",
    storageBucket: "import-export-hub-6d3de.firebasestorage.app",
    messagingSenderId: "506579946093",
    appId: "1:506579946093:web:d7573ef6875530a3970d64",
    measurementId: "G-H0Z6V3QPVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
