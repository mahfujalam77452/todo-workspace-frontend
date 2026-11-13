import styles from './Skeleton.module.css';

export default function Skeleton({ width = '100%', height = '1rem', className = '' }) {
  return <span className={`${styles.skeleton} ${className}`} style={{ width, height }} aria-hidden="true" />;
}