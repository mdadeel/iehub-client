import axios from 'axios';
import { auth } from './firebase.config';

// All env moved to backend — client uses relative /api.
// Dev: Vite proxies /api → http://localhost:5000 (see vite.config.js)
// Prod: Vercel rewrites /api → backend URL (see vercel.json)
const api = axios.create({
  baseURL: '/api',
});

// Helper to generate UUID client-side if needed
function generateClientCorrelationId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'req-' + Math.random().toString(36).slice(2, 11) + '-' + Date.now();
}

api.interceptors.request.use(
  async (config) => {
    try {
      // 1. Attach Request Correlation ID for tracing
      if (!config.headers['X-Correlation-ID']) {
        config.headers['X-Correlation-ID'] = generateClientCorrelationId();
      }

      // 2. Attach Active Organization ID
      const activeOrgId = localStorage.getItem('activeOrgId');
      if (activeOrgId) {
        config.headers['X-Org-Id'] = activeOrgId;
      }

      // 3. Attach Authentication Token
      // In development mode only, support local sandbox guest/demo admin tokens
      const isDev = import.meta.env.DEV;
      const guestUserStr = localStorage.getItem('guestUser');

      if (isDev && guestUserStr) {
        try {
          const guestUser = JSON.parse(guestUserStr);
          if (guestUser?.isAdmin) {
            config.headers.Authorization = 'Bearer demo-admin-token';
          } else if (guestUser?.uid) {
            config.headers.Authorization = `Bearer guest-token-${guestUser.uid}`;
          }
        } catch {
          // Ignore JSON parse error and proceed to standard auth
        }
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn('Could not attach auth token or correlation ID to request', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - authentication required');
    } else if (error.response?.status === 403) {
      console.warn('Forbidden access - organization authority required');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred', {
        correlationId: error.response?.headers?.['x-correlation-id'] || error.response?.data?.correlationId,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
