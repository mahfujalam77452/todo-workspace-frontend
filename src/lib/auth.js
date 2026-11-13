import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { backendFetch } from './backend';
import { ApiError } from './errors';
import { ACCESS_COOKIE } from './session';
import { ROLES } from './constants';

// React.cache makes sure /auth/me is fetched only once per request,
// even if the layout and the page both ask for the user.
export const getSession = cache(async () => {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    return await backendFetch('/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

export async function requireUser() {
  const user = await getSession();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== ROLES.ADMIN) redirect('/todos');
  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getSession();
  if (user) redirect('/todos');
}