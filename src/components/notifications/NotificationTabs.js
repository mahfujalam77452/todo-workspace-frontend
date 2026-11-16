import Link from 'next/link';
import styles from './Notifications.module.css';

const TABS = [
  { label: 'All', value: '', href: '/notifications' },
  { label: 'Unread', value: 'false', href: '/notifications?is_read=false' },
];

export default function NotificationTabs({ active }) {
  return (
    <nav className={styles.tabs} aria-label="Notification views">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}