const API_BASE_URL = import.meta.env.VITE_PROD
  ? 'https://ims-backend-m327.onrender.com'
  : '/api'; // local dev uses proxy

export { API_BASE_URL };

