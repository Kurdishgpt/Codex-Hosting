export const getApiBase = (): string => {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
};

export const getSocketBase = (): string => {
  return import.meta.env.VITE_SOCKET_BASE_URL?.replace(/\/$/, '') ?? window.location.origin;
};

export const getApiUrl = (path: string): string => {
  const base = getApiBase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const API_URL = '/api';
export const SOCKET_URL = getSocketBase();
