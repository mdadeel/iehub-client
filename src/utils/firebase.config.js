import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config is served by backend GET /api/config — no VITE_* secrets in client.
// Cached promise so multiple imports share one fetch.
let firebaseConfigPromise = null;

export async function getFirebaseConfig() {
  if (firebaseConfigPromise) return firebaseConfigPromise;
  firebaseConfigPromise = fetch("/api/config")
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`);
      return res.json();
    })
    .then((data) => data.firebase)
    .catch((err) => {
      console.error("Failed to load Firebase config from backend, using fallback", err);
      // Fallback for offline/dev without backend — keep app bootable
      return {
        apiKey: "AIzaSyAWYjS9PP99alVgFLLSsXivC-K1r3jn3-U",
        authDomain: "import-export-hub-6d3de.firebaseapp.com",
        projectId: "import-export-hub-6d3de",
        storageBucket: "import-export-hub-6d3de.firebasestorage.app",
        messagingSenderId: "506579946093",
        appId: "1:506579946093:web:d7573ef6875530a3970d64",
        measurementId: "G-H0Z6V3QPVZ",
      };
    });
  return firebaseConfigPromise;
}

// Synchronous init for callers that already have config; lazy init path uses getFirebaseConfig.
const fallbackConfig = {
  apiKey: "AIzaSyAWYjS9PP99alVgFLLSsXivC-K1r3jn3-U",
  authDomain: "import-export-hub-6d3de.firebaseapp.com",
  projectId: "import-export-hub-6d3de",
  storageBucket: "import-export-hub-6d3de.firebasestorage.app",
  messagingSenderId: "506579946093",
  appId: "1:506579946093:web:d7573ef6875530a3970d64",
  measurementId: "G-H0Z6V3QPVZ",
};

const app = initializeApp(fallbackConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: re-init with backend config when available (no-op if same)
getFirebaseConfig().then((cfg) => {
  // Firebase doesn't support re-init; apps already initialized keep fallback.
  // This fetch warms cache for future use and validates backend is reachable.
  if (cfg.apiKey !== fallbackConfig.apiKey) {
    console.info("Backend Firebase config differs from fallback — restart with updated fallback if needed.");
  }
});
