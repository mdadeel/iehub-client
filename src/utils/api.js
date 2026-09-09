import axios from 'axios';
import { auth } from './firebase.config';

// All env moved to backend — client uses relative /api.
// Dev: Vite proxies /api → http://localhost:5000 (see vite.config.js)
// Prod: Vercel rewrites /api → backend URL (see vercel.json)
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        const guestUserStr = localStorage.getItem('guestUser');
        if (guestUserStr) {
          try {
            const guestUser = JSON.parse(guestUserStr);
            if (guestUser?.isAdmin) {
              config.headers.Authorization = 'Bearer demo-admin-token';
            } else if (guestUser?.uid) {
              config.headers.Authorization = `Bearer guest-token-${guestUser.uid}`;
            }
          } catch {
            // ignore JSON parse error
          }
        }
      }
    } catch (err) {
      console.warn('Could not attach auth token to request', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - please log in');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default api;
