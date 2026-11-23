import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import styles from './Dashboard.module.css';

export default async function CompletionHeatmap() {
  const { data, error } = await safeBackendFetch('/admin/dashboard/heatmap');
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;
  const heatmapData = Array.isArray(data) ? data : [];
  const max = Math.max(...heatmapData.map((item) => item?.count ?? 0), 1);
  const level = (count) => {
    if (!count) return 0;
    if (count >= max * 0.75) return 4;
    if (count >= max * 0.5) return 3;
    if (count >= max * 0.25) return 2;
    return 1;
  };
  const cells = heatmapData.length
    ? [...Array.from({ length: heatmapData[0].weekday }), ...heatmapData]
    : [];
  return (
    <section className={styles.panel} aria-labelledby="heatmap-title">
      <h2 id="heatmap-title">Task completion activity (last 90 days)</h2>
      {heatmapData.length === 0 || heatmapData.every((item) => item.count === 0) ? <p className={styles.clear}>No completed tasks in the last 90 days.</p> : (
        <div className={styles.heatmapWrap}>
          <div className={styles.weekdayLabels} aria-hidden="true">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className={styles.heatmap} aria-label="Task completion heatmap">
            {cells.map((item, index) => item?.date ? (
              <span
                key={item.date}
                className={`${styles.heatmapCell} ${styles[`heatmapLevel${level(item.count)}`]}`}
                title={`${item.date}: ${item.count} completed`}
                aria-label={`${item.date}: ${item.count} completed`}
              />
            ) : <span key={`empty-${index}`} className={styles.heatmapCell} aria-hidden="true" />)}
          </div>
        </div>
      )}
    </section>
  );
}
