'use server';

import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { teamMembersTag } from '@/lib/server-data';

// Called after an admin changes a user's team, so the assign pickers do not show old members.
export async function revalidateTeamMembers(teamIds) {
  await requireAdmin();
  for (const id of teamIds) {
    if (Number.isInteger(id)) revalidateTag(teamMembersTag(id));
  }
}