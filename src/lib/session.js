import { secondsUntilExpiry } from './jwt';

export const ACCESS_COOKIE = 'todo_access';
export const REFRESH_COOKIE = 'todo_refresh';

// Used only when a token has no readable "exp" claim.
const FALLBACK_ACCESS_SECONDS = 5 * 60;
const FALLBACK_REFRESH_SECONDS = 7 * 24 * 60 * 60;

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

function getMaxAge(token, fallback) {
  const seconds = secondsUntilExpiry(token);
  return seconds !== null && seconds > 0 ? seconds : fallback;
}

// cookieStore can be `cookies()` (route handlers) or `response.cookies` (middleware/route handlers).
export function setSessionCookies(cookieStore, { access, refresh }) {
  cookieStore.set(ACCESS_COOKIE, access, {
    ...baseOptions,
    maxAge: getMaxAge(access, FALLBACK_ACCESS_SECONDS),
  });
  cookieStore.set(REFRESH_COOKIE, refresh, {
    ...baseOptions,
    maxAge: getMaxAge(refresh, FALLBACK_REFRESH_SECONDS),
  });
}

export function clearSessionCookies(cookieStore) {
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}