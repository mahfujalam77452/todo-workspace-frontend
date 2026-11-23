import Link from 'next/link';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import TodoCard from '@/components/todos/TodoCard';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import styles from '@/components/todos/Todos.module.css';

export default async function BottleneckTodosSection({ kind }) {
  const { data, error } = await safeBackendFetch(`/admin/dashboard/bottlenecks/${kind}`);
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;
  return (
    <>
      <Link href="/admin" className={styles.back}>&larr; Back to bottlenecks</Link>
      <p className={styles.meta}>Reporting period: last 14 days</p>
      {data.length === 0 ? (
        <EmptyState title="No todos found" />
      ) : (
        <ul className={styles.cardList}>
          {data.map((todo) => <TodoCard key={todo.id} todo={todo} basePath="/admin/todos" />)}
        </ul>
      )}
    </>
  );
}
