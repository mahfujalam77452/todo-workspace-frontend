import { formatPercent } from '@/lib/format';
import styles from './Dashboard.module.css';

export default function RatioBar({ value, danger = false }) {
  const rate = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className={styles.ratio}>
      <div className={styles.ratioTrack} aria-hidden="true">
        <div
          className={`${styles.ratioFill} ${danger ? styles.ratioFillDanger : ''}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span>{formatPercent(rate)}</span>
    </div>
  );
}