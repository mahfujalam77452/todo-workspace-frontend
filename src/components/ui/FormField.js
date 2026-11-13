import styles from './FormField.module.css';

// Usage: <FormField label="Email" htmlFor="email" error={errors.email}><Input id="email" error={errors.email} /></FormField>
export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}