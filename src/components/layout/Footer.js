import Link from 'next/link';
import styles from './Footer.module.css';

// variant "full": big footer for the home page. variant "app": slim footer inside the app shell.
export default function Footer({ variant = 'app' }) {
  const year = new Date().getFullYear();

  if (variant === 'app') {
    return (
      <footer className={styles.compact}>
        <p>&copy; {year} TODOs Workspace</p>
        <p>Assign, accept and track work with your team.</p>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Link href="/" className={styles.brand}>
            {/* TODO: add logo here */}
            TODOs Workspace
          </Link>
          <p className={styles.tagline}>Hand off work. Know where it stands.</p>
        </div>

        <nav aria-label="Product">
          <h2 className={styles.heading}>Product</h2>
          <ul className={styles.list}>
            <li><Link href="/#features-title">Features</Link></li>
            <li><Link href="/#how-title">How it works</Link></li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <h2 className={styles.heading}>Get started</h2>
          <ul className={styles.list}>
            <li><Link href="/login">Log in</Link></li>
            <li><Link href="/register">Create account</Link></li>
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {year} TODOs Workspace. All rights reserved.</p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}