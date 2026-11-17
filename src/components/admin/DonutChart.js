import styles from './Dashboard.module.css';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Completed vs incomplete todos. Plain SVG, no chart library.
export default function DonutChart({ completed, incomplete }) {
  const total = completed + incomplete;
  const completedLength = total > 0 ? (completed / total) * CIRCUMFERENCE : 0;

  return (
    <figure className={styles.donut}>
      <svg viewBox="0 0 100 100" role="img" aria-label={`${completed} completed and ${incomplete} incomplete todos`}>
        {/* Full circle = incomplete, the arc on top = completed */}
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="14" className={styles.donutOpen} />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="14"
          className={styles.donutDone}
          strokeDasharray={`${completedLength} ${CIRCUMFERENCE}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" className={styles.donutText}>{total}</text>
      </svg>

      <figcaption>
        <ul className={styles.legend}>
          <li className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchDone}`} aria-hidden="true" />
            Completed: {completed}
          </li>
          <li className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchOpen}`} aria-hidden="true" />
            Incomplete: {incomplete}
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}