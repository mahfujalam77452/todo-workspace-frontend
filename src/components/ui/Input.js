import styles from './controls.module.css';

export default function Input({ id, error, className = '', ...props }) {
  return (
    <input
      id={id}
      className={`${styles.control} ${error ? styles.invalid : ''} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  );
}