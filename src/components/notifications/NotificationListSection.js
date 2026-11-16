import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Pagination from '@/components/ui/Pagination';
import { NOTIFICATION_RECENT_DAYS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import { buildTodoQuery } from '@/lib/todo-query';
import NotificationList from './NotificationList';

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function NotificationListSection({ filters, limit, offset }) {
  const { data, error } = await safeBackendFetch(`/notifications?${buildTodoQuery(filters, { limit, offset })}`);

  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  if (data.count === 0) {
    return filters.is_read === 'false' ? (
      <EmptyState title="You are all caught up" description="There are no unread notifications." />
    ) : (
      <EmptyState
        title="No notifications yet"
        description="You will be notified when a todo is assigned to you, or when someone answers your assignment."
      />
    );
  }

  // Group the items of this page into "Recent" and "Older".
  const cutoff = Date.now() - NOTIFICATION_RECENT_DAYS * DAY_MS;
  const recent = data.results.filter((item) => new Date(item.created_at).getTime() >= cutoff);
  const older = data.results.filter((item) => new Date(item.created_at).getTime() < cutoff);

  return (
    <>
      <NotificationList title="Recent" notifications={recent} />
      <NotificationList title="Older" notifications={older} />
      <Pagination total={data.count} limit={limit} offset={offset} basePath="/notifications" params={filters} />
    </>
  );
}