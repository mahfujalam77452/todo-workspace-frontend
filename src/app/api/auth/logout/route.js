import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { clearSessionCookies, REFRESH_COOKIE } from '@/lib/session';

export async function POST(request) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (refresh) {
    try {
      await backendFetch('/auth/logout', { method: 'POST', body: { refresh }, auth: false });
    } catch {
      // Ignore: the cookies are cleared below even if the backend call fails.
    }
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response.cookies);
  return response;
}