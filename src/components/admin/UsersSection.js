import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Pagination from '@/components/ui/Pagination';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import { buildTodoQuery } from '@/lib/todo-query';
import UsersTable from './UsersTable';
import styles from './Admin.module.css';

export default async function UsersSection({ filters, limit, offset, teams, currentUserId }) {
  const { data, error } = await safeBackendFetch(`/admin/users?${buildTodoQuery(filters, { limit, offset })}`);

  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  if (data.results.length === 0) {
    return <EmptyState title="No users found" description="Try changing or clearing the filters." />;
  }

  return (
    <>
      <p className={styles.count} aria-live="polite">
        {data.count} {data.count === 1 ? 'user' : 'users'}
      </p>
      <UsersTable users={data.results} teams={teams} currentUserId={currentUserId} />
      <Pagination total={data.count} limit={limit} offset={offset} basePath="/admin/users" params={filters} />
    </>
  );
}