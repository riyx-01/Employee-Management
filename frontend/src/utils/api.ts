import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const handleApiError = (err: any) => {
  if (err.response && err.response.data) {
    const data = err.response.data;
    if (typeof data === 'object' && data !== null) {
      const errorSource = data.errors || data;
      if (typeof errorSource === 'object' && errorSource !== null) {
        const messages = Object.entries(errorSource).map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          if (typeof value === 'object' && value !== null) {
            return `${key}: ${JSON.stringify(value)}`;
          }
          return `${key}: ${value}`;
        });
        return messages.join('\n');
      }
    }
    return String(data);
  }
  return err.message || 'An unknown error occurred';
};

export default api;
