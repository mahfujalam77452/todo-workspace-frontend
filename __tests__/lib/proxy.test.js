/** @jest-environment node */
import { NextRequest } from 'next/server';
import { isAllowed } from '@/lib/proxy-allowlist';
import { GET } from '@/app/api/[...path]/route';

function callProxy(path, cookie) {
  const request = new NextRequest(`http://localhost:3000/api/${path}`, {
    headers: cookie ? { cookie } : {},
  });
  return GET(request, { params: Promise.resolve({ path: path.split('/') }) });
}

describe('proxy allowlist', () => {
  it('allows known paths and blocks everything else', () => {
    expect(isAllowed('/todos', 'GET')).toBe(true);
    expect(isAllowed('/todos/5/accept', 'POST')).toBe(true);
    expect(isAllowed('/todos/5/accept', 'GET')).toBe(false);
    expect(isAllowed('/auth/login', 'POST')).toBe(false);
    expect(isAllowed('/todos/../auth/me', 'GET')).toBe(false);
  });
});

describe('proxy route', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = 'http://backend.test/api';
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
  });

  it('returns 401 without a cookie and does not call the backend', async () => {
    const response = await callProxy('todos');
    expect(response.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('adds the Authorization header from the cookie', async () => {
    const response = await callProxy('todos', 'todo_access=secret-token');
    expect(response.status).toBe(200);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://backend.test/api/todos');
    expect(options.headers.Authorization).toBe('Bearer secret-token');
    expect(await response.text()).not.toContain('secret-token');
  });

  it('blocks paths that are not allowlisted', async () => {
    const response = await callProxy('auth/me', 'todo_access=secret-token');
    expect(response.status).toBe(404);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});