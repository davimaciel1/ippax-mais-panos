// Configuration for deployment on Vercel

export const getAssetUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (Vercel), assets are served from the root
  // In development, they're served from the dev server
  if (import.meta.env.PROD) {
    return `/${cleanPath}`;
  }
  
  return `/${cleanPath}`;
};

export const API_URL = import.meta.env.VITE_API_URL || '';

export const IS_PRODUCTION = import.meta.env.PROD;