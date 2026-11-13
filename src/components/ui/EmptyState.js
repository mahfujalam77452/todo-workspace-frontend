import styles from './EmptyState.module.css';

export default function EmptyState({ title, description, action }) {
  return (
    <div className={styles.empty}>
      {/* TODO: add empty-state illustration here */}
      <h3>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}