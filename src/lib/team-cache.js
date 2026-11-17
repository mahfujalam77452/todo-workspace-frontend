import { revalidateTeams } from './revalidate-actions';

// Clears the cached team data after a change. If this fails, the caches simply
// expire by themselves, so the change itself is still successful.
export async function clearTeamCaches(teamIds = []) {
  try {
    await revalidateTeams(teamIds);
  } catch {
    // Ignore: the caches expire after a short time anyway.
  }
}