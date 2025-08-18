const API_BASE_URL = import.meta.env.VITE_PROD
  ? 'https://ims-be-4rqy.onrender.com'
  : '/api'; // local dev uses proxy

export { API_BASE_URL };

