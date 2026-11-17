'use server';

import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { DASHBOARD_TAG, TEAMS_TAG, teamMembersTag } from '@/lib/server-data';

// Called after an admin changes a user's team, so the assign pickers and the
// dashboard member counts do not show old data.
export async function revalidateTeamMembers(teamIds) {
  await requireAdmin();
  revalidateTag(DASHBOARD_TAG);
  for (const id of teamIds) {
    if (Number.isInteger(id)) revalidateTag(teamMembersTag(id));
  }
}

// Called after an admin creates, renames or deletes a team.
// Clears the team list, the dashboard numbers and the member lists of the given teams.
export async function revalidateTeams(teamIds = []) {
  await requireAdmin();
  revalidateTag(TEAMS_TAG);
  revalidateTag(DASHBOARD_TAG);
  for (const id of teamIds) {
    if (Number.isInteger(id)) revalidateTag(teamMembersTag(id));
  }
}