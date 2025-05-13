// API configuration
const isProduction = import.meta.env.PROD;

// In production (Vercel), use relative URLs
// In development, use the local server URL
export const API_BASE_URL = isProduction ? '' : 'http://localhost:3001';
