import styles from './controls.module.css';

export default function Textarea({ id, error, className = '', ...props }) {
  return (
    <textarea
      id={id}
      className={`${styles.control} ${styles.textarea} ${error ? styles.invalid : ''} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  );
}