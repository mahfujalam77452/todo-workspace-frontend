import styles from './Badge.module.css';

// Always put a text label inside, so the status is not shown by color alone.
export default function Badge({ tone = 'neutral', children }) {
  // tone: neutral | success | warning | danger | info
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}