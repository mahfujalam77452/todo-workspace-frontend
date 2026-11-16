import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ButtonLink from '@/components/ui/ButtonLink';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import { buildTodoQuery } from '@/lib/todo-query';
import TodoList from './TodoList';
import styles from './Todos.module.css';

export default async function TodoListSection({ filters, limit, offset }) {
  const { data, error } = await safeBackendFetch(`/todos?${buildTodoQuery(filters, { limit, offset })}`);

  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  if (data.count === 0) {
    const hasFilters = Object.keys(filters).length > 0;
    return hasFilters ? (
      <EmptyState
        title="No todos match these filters"
        description="Try changing or clearing the filters."
        action={<ButtonLink href="/todos" variant="secondary">Show all todos</ButtonLink>}
      />
    ) : (
      <EmptyState
        title="No todos yet"
        description="Create a todo with the New todo button, or wait for a teammate to assign one to you."
      />
    );
  }

  // The offset can be past the end if the list got shorter. Offer a way back.
  if (data.results.length === 0) {
    return (
      <EmptyState
        title="Nothing on this page"
        action={<ButtonLink href="/todos" variant="secondary">Back to the first page</ButtonLink>}
      />
    );
  }

  return (
    <>
      <p className={styles.count} aria-live="polite">
        {data.count} {data.count === 1 ? 'todo' : 'todos'}
      </p>
      <TodoList todos={data.results} />
      <Pagination total={data.count} limit={limit} offset={offset} basePath="/todos" params={filters} />
    </>
  );
}