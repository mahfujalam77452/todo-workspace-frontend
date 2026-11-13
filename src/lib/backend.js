// Server-only helpers. Never import this file in a Client Component.
import { cookies } from 'next/headers';
import { ApiError } from './errors';
import { ACCESS_COOKIE } from './session';
import { BACKEND_TIMEOUT_MS } from './constants';

function getBaseUrl() {
  const url = process.env.BACKEND_API_URL;
  if (!url) throw new Error('BACKEND_API_URL is not set. Copy .env.local.example to .env.local.');
  return url.replace(/\/$/, '');
}

// Low level call. Returns the raw Response so the proxy can pass it through.
export async function callBackend(path, { method = 'GET', body, token, next, timeoutMs = BACKEND_TIMEOUT_MS } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${getBaseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined || typeof body === 'string' ? body : JSON.stringify(body),
      // Data is never cached unless the caller asks for it with `next: { revalidate, tags }`.
      cache: next ? undefined : 'no-store',
      next,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(504, 'The server took too long to respond.');
    }
    throw new ApiError(503, 'Could not reach the server.');
  } finally {
    clearTimeout(timer);
  }
}

// High level call for Server Components and Route Handlers.
// Reads the access token from the cookie, returns parsed JSON, throws ApiError on failure.
export async function backendFetch(path, options = {}) {
  const { auth = true, ...rest } = options;
  const token = auth ? (await cookies()).get(ACCESS_COOKIE)?.value : undefined;

  const response = await callBackend(path, { ...rest, token });
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error || response.statusText || 'Request failed',
      data?.details ?? null,
      response.headers.get('Retry-After'),
    );
  }
  return data;
}