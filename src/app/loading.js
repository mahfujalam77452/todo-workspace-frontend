import styles from './loading.module.css';

// Shown while a page outside the app (home, login, register) loads.
export default function Loading() {
  return (
    <div className={styles.page} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}