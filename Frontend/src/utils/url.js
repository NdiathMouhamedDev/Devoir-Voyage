export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function storageUrl(path) {
  if (!path) return '';
  return `${apiBaseUrl}/storage/${path}`;
}
