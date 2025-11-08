export const getApiBase = (): string => {
  // Check for explicit backend URL from environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  
  // Always use relative URLs - Vite proxy will handle routing in dev
  // In production, API should be on same origin
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
