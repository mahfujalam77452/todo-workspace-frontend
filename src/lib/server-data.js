// Server-only data helpers for Server Components.
import { redirect } from 'next/navigation';
import { backendFetch } from './backend';
import { ApiError } from './errors';
import { cache } from 'react';

export function teamMembersTag(teamId) {
  return `team-members-${teamId}`;
}

// Returns { data, error } instead of throwing, so a page can show an error message for its section.
// A 401 sends the user to /login.
export async function safeBackendFetch(path, options) {
  try {
    return { data: await backendFetch(path, options), error: null };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.status === 401) redirect('/login');
    return { data: null, error };
  }
}

// Categories rarely change, so they are cached for 5 minutes. Returns null if the request fails.
export async function getCategories() {
  const { data } = await safeBackendFetch('/categories', { next: { revalidate: 300 } });
  return data;
}

// Team members are cached for 1 minute with a tag. Phase 4 calls revalidateTag when an admin changes a team.
// Returns null if the request fails.
export async function getTeamMembers(teamId) {
  const { data } = await safeBackendFetch(`/teams/${teamId}/members`, {
    next: { revalidate: 60, tags: [teamMembersTag(teamId)] },
  });
  return data;
}

// Teams are fixed (seeded), so they are cached for 1 hour.
export async function getTeams() {
  const { data } = await safeBackendFetch('/teams', { next: { revalidate: 3600 } });
  return data;
}


// Dashboard data is cached for 30 seconds.
const DASHBOARD_CACHE = { revalidate: 30 };

// React.cache: the overview is used by two sections of the page, but it is requested only once.
export const getDashboardOverview = cache(() =>
  safeBackendFetch('/admin/dashboard/overview', { next: DASHBOARD_CACHE }),
);

export function getDashboardTeams() {
  return safeBackendFetch('/admin/dashboard/teams', { next: DASHBOARD_CACHE });
}

export function getDashboardUsers(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return safeBackendFetch(`/admin/dashboard/users${query}`, { next: DASHBOARD_CACHE });
}

export function getDashboardActivity(limit = 15) {
  return safeBackendFetch(`/admin/dashboard/activity?limit=${limit}`, { next: DASHBOARD_CACHE });
}