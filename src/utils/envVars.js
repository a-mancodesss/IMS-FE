const API_BASE_URL = import.meta.env.VITE_PROD
  ? 'https://imsbe.itclub.asmitphuyal.com.np'
  : '/api'; // local dev uses proxy

export { API_BASE_URL };

