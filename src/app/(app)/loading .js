import Skeleton from '@/components/ui/Skeleton';
import styles from '@/components/todos/Todos.module.css';

// Shown inside the app shell while a page loads. The navbar and sidebar stay on screen.
export default function AppLoading() {
  return (
    <div className={styles.skeletonStack} role="status" aria-label="Loading page">
      <span className="visually-hidden">Loading…</span>
      <Skeleton height="2rem" width="40%" />
      <Skeleton height="3rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
    </div>
  );
}