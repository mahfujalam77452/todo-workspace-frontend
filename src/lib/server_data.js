// Server-only data helpers for Server Components.
import { redirect } from 'next/navigation';
import { backendFetch } from './backend';
import { ApiError } from './errors';

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