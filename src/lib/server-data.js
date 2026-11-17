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

export const CATEGORIES_TAG = 'categories';

// Same options everywhere, so the category list is one cache entry (5 minutes).
// Cleared with revalidateTag(CATEGORIES_TAG) when an admin changes a category.
export const CATEGORIES_FETCH_OPTIONS = { next: { revalidate: 300, tags: [CATEGORIES_TAG] } };

export async function getCategories() {
  const { data } = await safeBackendFetch('/categories', CATEGORIES_FETCH_OPTIONS);
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
  const { data } = await safeBackendFetch('/teams', TEAMS_FETCH_OPTIONS);
  return data;
}
// Cache tags. revalidateTag clears the cache when an admin changes a team.
export const TEAMS_TAG = 'teams';
export const DASHBOARD_TAG = 'dashboard';

// Same options everywhere, so the team list is one cache entry (1 hour).
export const TEAMS_FETCH_OPTIONS = { next: { revalidate: 30, tags: [TEAMS_TAG] } };

// Dashboard data is cached for 30 seconds.
const DASHBOARD_CACHE = { revalidate: 30, tags: [DASHBOARD_TAG] };

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