import styles from './controls.module.css';

export default function Select({ id, error, className = '', children, ...props }) {
  return (
    <select
      id={id}
      className={`${styles.control} ${error ? styles.invalid : ''} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    >
      {children}
    </select>
  );
}