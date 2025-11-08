export const getApiBase = (): string => {
  // Check for explicit backend URL from environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  
  // In development mode, use relative URLs (proxy handles routing)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, try to use the backend from same origin
  // User should set VITE_API_BASE_URL for different domains
  return '';
};

export const getSocketBase = (): string => {
  const envUrl = import.meta.env.VITE_SOCKET_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  
  // Fallback to current origin
  return window.location.origin;
};

export const getApiUrl = (path: string): string => {
  const base = getApiBase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const API_URL = '/api';
export const SOCKET_URL = getSocketBase();
