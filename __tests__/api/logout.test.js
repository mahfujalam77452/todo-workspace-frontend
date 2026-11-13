/** @jest-environment node */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/logout/route';

function logoutRequest() {
  return new NextRequest('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: { cookie: 'todo_access=access-token; todo_refresh=refresh-token' },
  });
}

describe('logout route', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = 'http://backend.test/api';
  });

  it('sends the refresh token to the backend and clears the cookies', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 204 }));

    const response = await POST(logoutRequest());

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://backend.test/api/auth/logout');
    expect(JSON.parse(options.body)).toEqual({ refresh: 'refresh-token' });

    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    cookies.forEach((cookie) => expect(cookie).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/i));
  });

  it('still clears the cookies when the backend call fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    const response = await POST(logoutRequest());

    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()).toHaveLength(2);
  });
});