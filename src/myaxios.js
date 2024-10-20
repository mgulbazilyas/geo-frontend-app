// src/myaxios.js
import axios from 'axios';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'any-value';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL, // Replace with your API base URL
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':  'any-value',

    // Add any other headers you need
  },
});

// Optional: Add interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request here, e.g., add authentication tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // You can process the response data here
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
