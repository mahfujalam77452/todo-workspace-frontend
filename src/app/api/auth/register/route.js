import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { setSessionCookies } from '@/lib/session';
import { errorResponse } from '@/lib/route-response';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body', code: 400 }, { status: 400 });
  }

  try {
    const user = await backendFetch('/auth/register', { method: 'POST', body, auth: false });

    // The backend does not return tokens on register, so log in right away.
    try {
      const data = await backendFetch('/auth/login', {
        method: 'POST',
        body: { email: body.email, password: body.password },
        auth: false,
      });
      const response = NextResponse.json({ user: data.user, loggedIn: true }, { status: 201 });
      setSessionCookies(response.cookies, data);
      return response;
    } catch {
      // Account exists, only the automatic login failed. The UI sends the user to /login.
      return NextResponse.json({ user, loggedIn: false }, { status: 201 });
    }
  } catch (error) {
    return errorResponse(error);
  }
}