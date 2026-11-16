'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import LocalTime from '@/components/todos/LocalTime';
import { apiFetch } from '@/lib/api-client';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/constants';
import { requestNotificationRefresh } from '@/lib/notification-events';
import { getNotificationHref } from '@/lib/notification-link';
import styles from './Notifications.module.css';

const TYPE_TONES = { assigned: 'info', accepted: 'success', rejected: 'danger' };

export default function NotificationItem({ notification }) {
  const router = useRouter();
  const href = getNotificationHref(notification);

  // Marks the item as read and updates the bell. Errors are ignored: the item stays unread.
  async function markRead() {
    if (notification.is_read) return;
    try {
      await apiFetch(`/notifications/${notification.id}/read`, { method: 'POST', body: {} });
      requestNotificationRefresh();
    } catch {
      // Ignore: the user can try again later.
    }
  }

  async function markReadAndRefresh() {
    await markRead();
    router.refresh();
  }

  const content = (
    <>
      <div className={styles.itemTop}>
        <Badge tone={TYPE_TONES[notification.type] || 'neutral'}>
          {NOTIFICATION_TYPE_LABELS[notification.type] || 'Update'}
        </Badge>
        {!notification.is_read && <Badge tone="warning">New</Badge>}
      </div>
      <p className={styles.message}>{notification.message}</p>
      <p className={styles.meta}>
        <LocalTime value={notification.created_at} />
      </p>
    </>
  );

  const className = `${styles.item} ${notification.is_read ? '' : styles.unread}`;

  // With a todo: a normal link. Clicking marks it read and opens the todo.
  if (href) {
    return (
      <li>
        <Link href={href} className={className} onClick={markRead}>
          {content}
        </Link>
      </li>
    );
  }

  // No todo to open: an unread item is a button that only marks it as read.
  if (!notification.is_read) {
    return (
      <li>
        <button type="button" className={className} onClick={markReadAndRefresh}>
          {content}
        </button>
      </li>
    );
  }

  return <li className={className}>{content}</li>;
}