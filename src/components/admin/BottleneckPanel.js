import Link from 'next/link';
import { formatPercent } from '@/lib/format';
import styles from './Dashboard.module.css';

function Status({ count }) {
  return count > 0 ? (
    <span className={styles.attention}>Needs attention</span>
  ) : (
    <span className={styles.clear}>All clear</span>
  );
}

export default function BottleneckPanel({ bottlenecks }) {
  const staleAssignments = bottlenecks.pending_assignments_over_7_days;
  const overdue = bottlenecks.overdue_todos;
  const rejectionUsers = bottlenecks.high_rejection_users ?? [];

  return (
    <>
      <dl className={styles.bottleneckList}>
        <div className={styles.bottleneckItem}>
          <dt>Pending assignments older than 7 days</dt>
          <dd>{staleAssignments}</dd>
          <Status count={staleAssignments} />
        </div>
        <div className={styles.bottleneckItem}>
          <dt>Overdue todos</dt>
          <dd>{overdue}</dd>
          <Status count={overdue} />
        </div>
        <div className={styles.bottleneckItem}>
          <dt>Users with a high rejection rate</dt>
          <dd>{rejectionUsers.length}</dd>
          <Status count={rejectionUsers.length} />
        </div>
      </dl>

      {rejectionUsers.length > 0 && (
        <ul className={styles.rejectionList}>
          {rejectionUsers.map((user) => (
            <li key={user.id}>
              <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
              {` rejects ${formatPercent(user.rejection_rate)} of assignments`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}