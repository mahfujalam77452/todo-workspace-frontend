import Skeleton from '@/components/ui/Skeleton';
import styles from './Notifications.module.css';

export default function NotificationSkeleton() {
  return (
    <div role="status" aria-label="Loading notifications">
      <span className="visually-hidden">Loading notifications…</span>
      <ul className={styles.list}>
        {[1, 2, 3].map((item) => (
          <li key={item} className={styles.skeletonCard}>
            <Skeleton height="1.25rem" width="30%" />
            <Skeleton width="80%" />
            <Skeleton width="25%" />
          </li>
        ))}
      </ul>
    </div>
  );
}