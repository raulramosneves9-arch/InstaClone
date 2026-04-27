const relativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function normalizeDate(dateParam) {
  return dateParam instanceof Date ? dateParam : new Date(dateParam);
}

export function timeAgo(dateParam) {
  const date = normalizeDate(dateParam);
  const now = new Date();
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);

  if (Math.abs(seconds) < 60) return 'agora';

  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeTimeFormatter.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTimeFormatter.format(hours, 'hour');

  const days = Math.round(hours / 24);
  return relativeTimeFormatter.format(days, 'day');
}

export function formatShortDate(dateParam) {
  return shortDateFormatter.format(normalizeDate(dateParam));
}

export function formatDateTime(dateParam) {
  return dateTimeFormatter.format(normalizeDate(dateParam));
}
