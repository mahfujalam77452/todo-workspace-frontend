import NotificationItem from './NotificationItem';
import styles from './Notifications.module.css';

export default function NotificationList({ title, notifications }) {
  if (notifications.length === 0) return null;

  const headingId = `group-${title.toLowerCase()}`;

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <ul className={styles.list}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </section>
  );
}