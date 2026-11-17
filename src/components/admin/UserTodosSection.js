import Link from 'next/link';
import { notFound } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import TodoList from '@/components/todos/TodoList';
import todoStyles from '@/components/todos/Todos.module.css';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Assigned to this user', value: 'assigned' },
  { label: 'Created by this user', value: 'created' },
];

export default async function UserTodosSection({ id, show }) {
  const [userResult, todosResult] = await Promise.all([
    safeBackendFetch(`/admin/users/${id}`),
    safeBackendFetch(`/admin/users/${id}/todos`),
  ]);

  if (userResult.error?.status === 404 || todosResult.error?.status === 404) notFound();

  const error = userResult.error || todosResult.error;
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  const user = userResult.data;
  const all = todosResult.data;

  let todos = all;
  if (show === 'assigned') todos = all.filter((todo) => todo.assignee?.id === user.id);
  if (show === 'created') todos = all.filter((todo) => todo.assigner?.id === user.id);

  return (
    <div className={todoStyles.detail}>
      <header className={todoStyles.detailHeader}>
        <h1 className={todoStyles.detailTitle}>{user.name}</h1>
        <p className={todoStyles.meta}>{user.email}</p>
        <div className={todoStyles.badges}>
          <Badge tone={user.role === 'admin' ? 'info' : 'neutral'}>{user.role === 'admin' ? 'Admin' : 'Member'}</Badge>
          <Badge>{user.team ? user.team.name : 'No team'}</Badge>
          <Badge>Created: {user.created_count}</Badge>
          <Badge>Assigned: {user.assigned_count}</Badge>
        </div>
        <p className={todoStyles.notice}>Read-only view. Admins can look at todos but cannot change them.</p>
      </header>

      <nav className={todoStyles.tabs} aria-label="Todo views">
        {TABS.map((tab) => {
          const active = tab.value === (show || '');
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/admin/users/${id}?show=${tab.value}` : `/admin/users/${id}`}
              className={`${todoStyles.tab} ${active ? todoStyles.tabActive : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {todos.length === 0 ? (
        <EmptyState title="No todos" description="This user has no todos in this view." />
      ) : (
        <>
          <p className={todoStyles.count}>
            {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
          </p>
          <TodoList todos={todos} basePath="/admin/todos" />
        </>
      )}
    </div>
  );
}