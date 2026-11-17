import styles from './Dashboard.module.css';

// items: [{ id, label, value, total, caption }]. The bar shows value out of total.
export default function BarChart({ items }) {
  return (
    <ul className={styles.bars}>
      {items.map((item) => {
        const percent = item.total > 0 ? Math.min((item.value / item.total) * 100, 100) : 0;
        return (
          <li key={item.id}>
            <div className={styles.barHead}>
              <span className={styles.barLabel}>{item.label}</span>
              <span className={styles.barText}>{item.caption}</span>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div className={styles.barFill} style={{ width: `${percent}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}