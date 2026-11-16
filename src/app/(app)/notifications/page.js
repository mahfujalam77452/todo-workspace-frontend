import { Suspense } from 'react';
import { requireUser } from '@/lib/auth';
import { getPaging, pickFilters } from '@/lib/todo-query';
import MarkAllReadButton from '@/components/notifications/MarkAllReadButton';
import NotificationListSection from '@/components/notifications/NotificationListSection';
import NotificationSkeleton from '@/components/notifications/NotificationSkeleton';
import NotificationTabs from '@/components/notifications/NotificationTabs';
import styles from '@/components/notifications/Notifications.module.css';

export const metadata = { title: 'Notifications' };

export default async function NotificationsPage({ searchParams }) {
  await requireUser();

  const query = await searchParams;
  const filters = pickFilters(query, ['is_read']);
  if (!['true', 'false'].includes(filters.is_read)) delete filters.is_read; // the API accepts only these two
  const { limit, offset } = getPaging(query);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Notifications</h1>
        <MarkAllReadButton />
      </div>

      <NotificationTabs active={filters.is_read ?? ''} />

      <Suspense key={JSON.stringify({ filters, limit, offset })} fallback={<NotificationSkeleton />}>
        <NotificationListSection filters={filters} limit={limit} offset={offset} />
      </Suspense>
    </>
  );
}