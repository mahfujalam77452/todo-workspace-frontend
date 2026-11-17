import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { getDashboardOverview } from '@/lib/server-data';
import DonutChart from './DonutChart';
import ProgressRing from './ProgressRing';
import StatCard from './StatCard';
import styles from './Dashboard.module.css';

export default async function OverviewSection() {
  const { data, error } = await getDashboardOverview();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  return (
    <>
      <div className={styles.statGrid}>
        <StatCard label="Users" value={data.users} />
        <StatCard label="Teams" value={data.teams} />
        <StatCard label="Todos" value={data.todos} />
        <StatCard label="Incomplete" value={data.incomplete_todos} />
        <StatCard label="Completed" value={data.completed_todos} />
        <StatCard label="Pending assignments" value={data.pending_assignments} />
      </div>

      <div className={styles.twoCols}>
        <section className={styles.panel} aria-labelledby="completion-title">
          <h2 id="completion-title">Completion</h2>
          <ProgressRing value={data.completion_rate} label="Completion rate" />
        </section>

        <section className={styles.panel} aria-labelledby="split-title">
          <h2 id="split-title">Completed and incomplete</h2>
          <DonutChart completed={data.completed_todos} incomplete={data.incomplete_todos} />
        </section>
      </div>
    </>
  );
}