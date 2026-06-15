export function formatEntryDate(value) {
  if (!value) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}
