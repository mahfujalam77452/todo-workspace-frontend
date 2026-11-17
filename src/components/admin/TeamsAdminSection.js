import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { TEAMS_FETCH_OPTIONS, getDashboardTeams, safeBackendFetch } from '@/lib/server-data';
import TeamsTable from './TeamsTable';

export default async function TeamsAdminSection() {
  // /teams is the list of teams. The dashboard endpoint adds the member and todo counts.
  const [teamsResult, countsResult] = await Promise.all([
    safeBackendFetch('/teams', TEAMS_FETCH_OPTIONS),
    getDashboardTeams(),
  ]);

  if (teamsResult.error) return <ErrorMessage message={getErrorMessage(teamsResult.error)} />;

  const counts = {};
  for (const item of countsResult.data ?? []) counts[item.id] = item;

  const teams = teamsResult.data.map((team) => ({
    ...team,
    member_count: counts[team.id]?.member_count ?? null,
    todo_count: counts[team.id]?.todo_count ?? null,
  }));

  if (teams.length === 0) {
    return <EmptyState title="No teams yet" description="Create the first team with the New team button." />;
  }

  return <TeamsTable teams={teams} />;
}