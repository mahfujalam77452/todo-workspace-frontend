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
  const overloadedUsers = bottlenecks.overloaded_users ?? [];
  const inactiveUsers = bottlenecks.inactive_users ?? [];

  return (
    <>
      <dl className={styles.bottleneckList}>
        <div className={styles.bottleneckItem}>
          <dt><Link href="/admin/bottlenecks/pending-assignments">Pending assignments</Link></dt>
          <dd>{staleAssignments}</dd>
          <div className={styles.bottleneckStatus}><span>Older than 7 days</span><Status count={staleAssignments} /></div>
        </div>
        <div className={styles.bottleneckItem}>
          <dt><Link href="/admin/bottlenecks/overdue">Overdue todos</Link></dt>
          <dd>{overdue}</dd>
          <div className={styles.bottleneckStatus}><span>Requires review</span><Status count={overdue} /></div>
        </div>
        <div className={styles.bottleneckItem}>
          <dt><Link href="/admin/bottlenecks/unassigned">Unassigned todos</Link></dt>
          <dd>{bottlenecks.unassigned_todos ?? 0}</dd>
          <div className={styles.bottleneckStatus}><span>Needs an owner</span><Status count={bottlenecks.unassigned_todos ?? 0} /></div>
        </div>
        <div className={styles.bottleneckItem}>
          <dt>High rejection</dt>
          <dd>{rejectionUsers.length}</dd>
          <div className={styles.bottleneckStatus}><span>Affected users</span><Status count={rejectionUsers.length} /></div>
        </div>
        <div className={styles.bottleneckItem}>
          <dt>Overloaded users</dt>
          <dd>{overloadedUsers.length}</dd>
          <div className={styles.bottleneckStatus}><span>Above workload limit</span><Status count={overloadedUsers.length} /></div>
        </div>
        <div className={styles.bottleneckItem}>
          <dt>Inactive users (14 days)</dt>
          <dd>{inactiveUsers.length}</dd>
          <div className={styles.bottleneckStatus}><span>No recent activity</span><Status count={inactiveUsers.length} /></div>
        </div>
      </dl>

      {bottlenecks.overdue_alert?.count > bottlenecks.overdue_alert?.threshold && (
        <p className={styles.attention} role="alert">
          Overdue task alert: {bottlenecks.overdue_alert.count} tasks exceed the configured threshold of {bottlenecks.overdue_alert.threshold}.
        </p>
      )}

      {overloadedUsers.length > 0 && (
        <ul className={styles.rejectionList}>
          {overloadedUsers.map((user) => (
            <li key={user.id}>
              <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
              {` has ${user.active_count} active tasks`}
            </li>
          ))}
        </ul>
      )}

      {inactiveUsers.length > 0 && (
        <ul className={styles.rejectionList}>
          {inactiveUsers.map((user) => (
            <li key={user.id}>
              <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
              {' has no task activity in the last 14 days'}
            </li>
          ))}
        </ul>
      )}

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