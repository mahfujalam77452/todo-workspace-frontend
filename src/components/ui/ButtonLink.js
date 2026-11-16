import Link from 'next/link';
import styles from './Button.module.css';

export default function ButtonLink({ href, variant = 'primary', className = '', children, ...props }) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}