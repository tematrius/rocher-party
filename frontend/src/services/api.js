export const API_BASE = import.meta.env.VITE_API_BASE || 'https://rocher-party-production.up.railway.app/api';

// DEBUG: Affiche la valeur de l'API utilisée
console.log('API_BASE:', API_BASE);

export async function getPublicEvent(slug) {
  const response = await fetch(`${API_BASE}/events/${slug}/public`);
  if (!response.ok) throw new Error('Failed to fetch public event');
  return response.json();
}

export async function getFullEvent(slug) {
  const response = await fetch(`${API_BASE}/events/${slug}/full`);
  if (!response.ok) throw new Error('Failed to fetch full event');
  return response.json();
}

export async function getServerTime() {
  const response = await fetch(`${API_BASE}/time`);
  if (!response.ok) throw new Error('Failed to fetch server time');
  return response.json();
}
