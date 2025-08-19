const API_BASE_URL = import.meta.env.VITE_PROD
  ? 'http://imsbe.itclub.asmitphuyal.com.np'
  : '/api'; // local dev uses proxy

export { API_BASE_URL };

