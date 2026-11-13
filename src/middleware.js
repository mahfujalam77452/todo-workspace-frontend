import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, setSessionCookies, clearSessionCookies } from '@/lib/session';
import { secondsUntilExpiry } from '@/lib/jwt';
import { REFRESH_MARGIN_SECONDS } from '@/lib/constants';

// Runs only on protected pages and on the proxy (/api/auth/* is excluded below).
export const config = {
  matcher: ['/todos/:path*', '/notifications/:path*', '/admin/:path*', '/api/((?!auth).*)'],
};

async function refreshTokens(refresh) {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// No valid session: API calls get 401 JSON, pages are redirected to /login.
function rejectRequest(request) {
  const isApi = request.nextUrl.pathname.startsWith('/api');
  const response = isApi
    ? NextResponse.json({ error: 'Authentication required', code: 401 }, { status: 401 })
    : NextResponse.redirect(new URL('/login', request.url));
  clearSessionCookies(response.cookies);
  return response;
}

export async function middleware(request) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!access && !refresh) return rejectRequest(request);

  const secondsLeft = access ? secondsUntilExpiry(access) : 0;
  const needsRefresh = !access || (secondsLeft !== null && secondsLeft < REFRESH_MARGIN_SECONDS);
  if (!needsRefresh) return NextResponse.next();

  if (!refresh) return rejectRequest(request);

  const tokens = await refreshTokens(refresh);
  if (!tokens?.access || !tokens?.refresh) return rejectRequest(request);

  // 1) The current request must see the new tokens (pages and route handlers read them).
  request.cookies.set(ACCESS_COOKIE, tokens.access);
  request.cookies.set(REFRESH_COOKIE, tokens.refresh);
  const response = NextResponse.next({ request: { headers: request.headers } });

  // 2) The browser must store the new tokens (the old refresh token no longer works).
  setSessionCookies(response.cookies, tokens);
  return response;
}