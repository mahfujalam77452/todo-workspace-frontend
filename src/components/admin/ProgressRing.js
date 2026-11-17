import { formatPercent } from '@/lib/format';
import styles from './Dashboard.module.css';

// A ring drawn with a CSS conic-gradient. The number is also written in text.
export default function ProgressRing({ value, label }) {
  const rate = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <figure className={styles.ringWrap}>
      <div
        className={styles.ring}
        style={{ '--value': rate }}
        role="img"
        aria-label={`${label}: ${formatPercent(rate)}`}
      >
        <div className={styles.ringInner}>
          <span className={styles.ringValue}>{formatPercent(rate)}</span>
        </div>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}