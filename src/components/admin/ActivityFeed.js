import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import LocalTime from '@/components/todos/LocalTime';
import { ASSIGNMENT_STATUS_LABELS } from '@/lib/constants';
import { formatActivityType } from '@/lib/dashboard';
import styles from './Dashboard.module.css';

// names: { [userId]: "Name" }. The activity API only returns user ids.
export default function ActivityFeed({ items, names }) {
  return (
    <ul className={styles.feed}>
      {items.map((item, index) => (
        <li key={`${item.todo_id}-${item.occurred_at}-${index}`} className={styles.feedItem}>
          <p>
            <Badge tone="info">{formatActivityType(item.type)}</Badge>{' '}
            <Link href={`/admin/todos/${item.todo_id}`}>{item.title}</Link>
          </p>
          <p className={styles.feedMeta}>
            {names[item.user_id] || `User #${item.user_id}`} &middot; <LocalTime value={item.occurred_at} />
            {item.assignment_status &&
              ` · Assignment: ${ASSIGNMENT_STATUS_LABELS[item.assignment_status] || item.assignment_status}`}
          </p>
        </li>
      ))}
    </ul>
  );
}