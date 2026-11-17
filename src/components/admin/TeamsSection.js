import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { formatPercent } from '@/lib/format';
import { getDashboardTeams } from '@/lib/server-data';
import BarChart from './BarChart';
import styles from './Dashboard.module.css';

export default async function TeamsSection() {
  const { data, error } = await getDashboardTeams();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  const items = data.map((team) => ({
    id: team.id,
    label: team.name,
    value: team.completed_count,
    total: team.todo_count,
    caption:
      `${team.completed_count} of ${team.todo_count} completed (${formatPercent(team.completion_rate)})` +
      ` · ${team.member_count} members · ${team.pending_assignment_count} pending`,
  }));

  return (
    <section className={styles.panel} aria-labelledby="teams-title">
      <h2 id="teams-title">Teams</h2>
      {items.length === 0 ? <EmptyState title="No teams yet" /> : <BarChart items={items} />}
    </section>
  );
}