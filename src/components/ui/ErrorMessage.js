import styles from './ErrorMessage.module.css';

// Inline error for forms and page sections. `action` can hold a retry link or button.
export default function ErrorMessage({ message, action }) {
  return (
    <div className={styles.error} role="alert">
      {/* TODO: add warning icon here */}
      <p>{message}</p>
      {action}
    </div>
  );
}