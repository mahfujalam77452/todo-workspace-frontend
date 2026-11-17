import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { getDashboardOverview } from '@/lib/server-data';
import BottleneckPanel from './BottleneckPanel';
import styles from './Dashboard.module.css';

export default async function BottleneckSection() {
  // Same call as OverviewSection. React.cache makes it one request.
  const { data, error } = await getDashboardOverview();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  return (
    <section className={styles.panel} aria-labelledby="bottleneck-title">
      <h2 id="bottleneck-title">Bottlenecks</h2>
      <BottleneckPanel bottlenecks={data.bottlenecks} />
    </section>
  );
}