import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
    (config) => {
        // Add any request modifications here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error cases
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access - please log in');
        } else if (error.response?.status >= 500) {
            // Handle server errors
            console.error('Server error occurred');
        }

        return Promise.reject(error);
    }
);

export default api;
