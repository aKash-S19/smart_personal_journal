// --- backend connect ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  } catch {
    throw new Error('Backend is not reachable. Start Spring Boot on port 8080, then refresh.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Something went wrong while talking to the server.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getEntries() {
  return request('/journal');
}

export function createEntry(entry) {
  return request('/journal', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
}

export function updateEntry(id, entry) {
  return request(`/journal/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry)
  });
}

export function deleteEntry(id) {
  return request(`/journal/${id}`, {
    method: 'DELETE'
  });
}
