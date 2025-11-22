// FILE: stockmaster-frontend/src/lib/api.js
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Backend Envelope
api.interceptors.response.use(
  (response) => {
    // The backend contract:
    // Success: { success: true, data: <payload>, message: "..." }
    // Failure: { success: false, error: { code: "...", message: "..." } }

    const { success, data, error } = response.data;

    if (success) {
      // Unwrap the envelope and return the actual payload
      return data;
    } else {
      // Handle business logic errors (success: false inside 200 OK)
      const rejectionError = new Error(error?.message || 'An unknown error occurred');
      rejectionError.code = error?.code;
      return Promise.reject(rejectionError);
    }
  },
  (error) => {
    // Handle HTTP Protocol Errors (401, 403, 500, Network Error)
    let message = 'An unexpected error occurred.';

    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;

      // If the backend returns the standard envelope even on 4xx/5xx
      if (data && data.error && data.error.message) {
        message = data.error.message;
      } else {
        // Fallback messages based on status
        switch (status) {
          case 401:
            message = 'Unauthorized. Please log in again.';
            // Optional: Trigger a global logout event here if needed
            break;
          case 403:
            message = 'You do not have permission to perform this action.';
            break;
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 500:
            message = 'Internal Server Error. Please try again later.';
            break;
          default:
            message = `Error: ${status} - ${error.message}`;
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      message = 'Network error. Please check your connection.';
    }

    // Construct a standard error object to reject with
    const customError = new Error(message);
    customError.originalError = error;
    return Promise.reject(customError);
  }
);

export default api;