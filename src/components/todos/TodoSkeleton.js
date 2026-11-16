import Skeleton from '@/components/ui/Skeleton';
import styles from './Todos.module.css';

export default function TodoSkeleton() {
  return (
    <div role="status" aria-label="Loading todos">
      <span className="visually-hidden">Loading todos…</span>
      <ul className={styles.cardList}>
        {[1, 2, 3, 4].map((item) => (
          <li key={item} className={styles.skeletonCard}>
            <Skeleton height="1.25rem" width="70%" />
            <Skeleton height="1.5rem" width="50%" />
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TodoDetailSkeleton() {
  return (
    <div className={styles.skeletonStack} role="status" aria-label="Loading todo">
      <span className="visually-hidden">Loading todo…</span>
      <Skeleton height="2rem" width="60%" />
      <Skeleton height="1.5rem" width="40%" />
      <Skeleton height="6rem" />
      <Skeleton height="8rem" />
    </div>
  );
}