// Browser-side fetch. It only talks to our own Next.js server (/api/*), never to the backend.
import { ApiError } from './errors';

export async function apiFetch(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Network error');
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);

  // A 401 on a normal call means the session is gone. Wrong login credentials are not redirected.
  if (response.status === 401 && !path.startsWith('/auth/')) {
    window.location.assign('/login');
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error || 'Request failed',
      data?.details ?? null,
      response.headers.get('Retry-After'),
    );
  }
  return data;
}