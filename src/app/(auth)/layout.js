import Link from 'next/link';
import { redirectIfAuthenticated } from '@/lib/auth';
import styles from './auth-layout.module.css';

// Logged-in users never see login/register. They are sent to /todos.
export default async function AuthLayout({ children }) {
  await redirectIfAuthenticated();

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.brand}>TODOs Workspace</Link>
      <div className={styles.card}>{children}</div>
    </main>
  );
}