'use client';

import Link from 'next/link';
import useNotifications from '@/hooks/useNotifications';
import styles from '@/components/layout/Layout.module.css';

export default function NotificationBell() {
  const { count } = useNotifications();

  const label = count > 0 ? `Notifications, ${count} unread` : 'Notifications';
  const badge = count > 99 ? '99+' : String(count);

  return (
    <Link href="/notifications" className={styles.bell} aria-label={label}>
      {/* TODO: replace this temporary bell character with a bell icon */}
      <span aria-hidden="true">&#128276;</span>
      {count > 0 && (
        <span className={styles.bellBadge} aria-hidden="true">
          {badge}
        </span>
      )}
    </Link>
  );
}