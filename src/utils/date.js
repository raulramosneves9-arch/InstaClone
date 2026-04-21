// src/utils/date.js
export function timeAgo(dateParam) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours} h`;
  return `há ${days} d`;
}

// src/utils/format.js
export function formatCount(n) {
  if (n < 1000) return n;
  if (n < 1000000) return +(n / 1000).toFixed(1) + "k";
  return +(n / 1000000).toFixed(1) + "M";
}