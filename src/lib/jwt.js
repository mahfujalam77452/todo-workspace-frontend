// Reads the "exp" claim of a JWT. It does not verify the signature (the backend does that).
// Uses atob so it also works in the middleware (edge runtime).
export function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
}

export function secondsUntilExpiry(token) {
  const exp = getTokenExpiry(token);
  if (exp === null) return null;
  return exp - Math.floor(Date.now() / 1000);
}