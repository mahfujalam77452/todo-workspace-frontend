import Link from 'next/link';
import NotificationBell from '@/components/notifications/NotificationBell';
import UserMenu from './UserMenu';
import styles from './Layout.module.css';

export default function Navbar({ onOpenMenu }) {
  return (
    <header className={styles.navbar}>
      <button type="button" className={styles.menuButton} onClick={onOpenMenu} aria-label="Open menu">
        {/* TODO: add hamburger icon here */}
        &#9776;
      </button>
      <Link href="/todos" className={styles.brand}>TODOs Workspace</Link>
      <NotificationBell />
      <UserMenu />
    </header>
  );
}