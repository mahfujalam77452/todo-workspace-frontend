/** @jest-environment node */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

// A fake JWT. Only the "exp" claim matters for the middleware.
function makeToken(secondsFromNow) {
  const exp = Math.floor(Date.now() / 1000) + secondsFromNow;
  return `${encode({ alg: 'HS256' })}.${encode({ exp })}.signature`;
}

function makeRequest(path, cookies = {}) {
  const cookie = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
  return new NextRequest(`http://localhost:3000${path}`, { headers: cookie ? { cookie } : {} });
}

beforeEach(() => {
  process.env.BACKEND_API_URL = 'http://backend.test/api';
});

describe('middleware', () => {
  it('redirects a page request without cookies to /login', async () => {
    const response = await middleware(makeRequest('/todos'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('returns 401 JSON for an API request without cookies', async () => {
    const response = await middleware(makeRequest('/api/todos'));
    expect(response.status).toBe(401);
  });

  it('refreshes the tokens when the access token is about to expire', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ access: makeToken(900), refresh: makeToken(86400) }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await middleware(
      makeRequest('/todos', { todo_access: makeToken(10), todo_refresh: 'old-refresh' }),
    );

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://backend.test/api/auth/token/refresh');
    expect(JSON.parse(options.body)).toEqual({ refresh: 'old-refresh' });

    expect(response.headers.get('x-middleware-next')).toBe('1'); // the request continues
    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    cookies.forEach((cookie) => expect(cookie).toMatch(/HttpOnly/i));
  });

  it('clears the cookies and redirects to /login when the refresh fails', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response('{}', { status: 401 }));

    const response = await middleware(
      makeRequest('/todos', { todo_access: makeToken(10), todo_refresh: 'used-refresh' }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    expect(response.headers.getSetCookie()).toHaveLength(2);
  });
});