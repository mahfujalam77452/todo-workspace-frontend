import Link from 'next/link';
import { notFound } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import TodoList from '@/components/todos/TodoList';
import UserHistoryFilters from '@/components/admin/UserHistoryFilters';
import todoStyles from '@/components/todos/Todos.module.css';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Assigned to this user', value: 'assigned' },
  { label: 'Assigned by this user', value: 'created' },
];

export default async function UserTodosSection({ id, show, scrum, category, from, to, relation }) {
  const query = new URLSearchParams({ user: id });
  if (scrum) query.set('scrum', scrum);
  if (category) query.set('category', category);
  if (from) query.set('from', from);
  if (to) query.set('to', to);
  if (relation) query.set('relation', relation);
  const [userResult, historyResult, scrumsResult, categoriesResult] = await Promise.all([
    safeBackendFetch(`/admin/users/${id}`),
    safeBackendFetch(`/admin/dashboard/history?${query}`),
    safeBackendFetch('/admin/scrums'),
    safeBackendFetch('/categories'),
  ]);

  if (userResult.error?.status === 404) notFound();

  const error = userResult.error || historyResult.error;
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  const user = userResult.data;
  const todos = historyResult.data.todos;
  const statistics = historyResult.data.statistics;
  const scrums = scrumsResult.data ?? [];
  const categories = categoriesResult.data ?? [];
  const currentQuery = new URLSearchParams({ ...(scrum && { scrum }), ...(category && { category }), ...(from && { from }), ...(to && { to }), ...(relation && { relation }) });

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

      <UserHistoryFilters
        scrums={scrums}
        categories={categories}
        userTeamId={user.team?.id}
      />

      <nav className={todoStyles.tabs} aria-label="Todo views">
        {TABS.map((tab) => {
          const active = tab.value === (show || '');
          const tabParams = new URLSearchParams(currentQuery);
          tabParams.delete('relation');
          tabParams.delete('show');
          if (tab.value) {
            tabParams.set('show', tab.value);
            tabParams.set('relation', tab.value);
          }
          return (
            <Link
              key={tab.label}
              href={`/admin/users/${id}${tabParams.toString() ? `?${tabParams}` : ''}`}
              className={`${todoStyles.tab} ${active ? todoStyles.tabActive : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <dl className={todoStyles.statsGrid} aria-label="Todo statistics">
        <div className={todoStyles.statCard}>
          <dt>Completed</dt>
          <dd>{statistics.completed}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>High priority</dt>
          <dd>{statistics.completed_high}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Medium priority</dt>
          <dd>{statistics.completed_medium}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Low priority</dt>
          <dd>{statistics.completed_low}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Accepted</dt>
          <dd>{statistics.accepted}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Rejected</dt>
          <dd>{statistics.rejected}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Average response</dt>
          <dd>{statistics.average_response_time_seconds}s</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>On time</dt>
          <dd>{statistics.completed_on_time}</dd>
        </div>
        <div className={todoStyles.statCard}>
          <dt>Overdue</dt>
          <dd>{statistics.completed_overdue}</dd>
        </div>
      </dl>

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