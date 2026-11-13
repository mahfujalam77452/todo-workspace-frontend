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
    const data = await backendFetch('/auth/login', { method: 'POST', body, auth: false });

    // Tokens go into httpOnly cookies. The browser only receives the user.
    const response = NextResponse.json({ user: data.user });
    setSessionCookies(response.cookies, data);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}