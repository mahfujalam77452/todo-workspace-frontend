/** @jest-environment node */
import { POST } from '@/app/api/auth/login/route';

const credentials = { email: 'ayesha@example.com', password: 'StrongPassword123!' };
const user = { id: 1, name: 'Ayesha', email: 'ayesha@example.com', role: 'member', team: null };

function loginRequest() {
  return new Request('http://localhost:3000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

describe('login route', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = 'http://backend.test/api';
  });

  it('stores tokens in httpOnly cookies and returns only the user', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ access: 'access-token', refresh: 'refresh-token', user }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await POST(loginRequest());
    const text = await response.text();

    expect(JSON.parse(text)).toEqual({ user });
    expect(text).not.toContain('access-token');
    expect(text).not.toContain('refresh-token');

    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    cookies.forEach((cookie) => expect(cookie).toMatch(/HttpOnly/i));
  });

  it('passes backend errors through and sets no cookies', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Invalid credentials', code: 401 }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await POST(loginRequest());

    expect(response.status).toBe(401);
    expect(response.headers.getSetCookie()).toHaveLength(0);
  });
});