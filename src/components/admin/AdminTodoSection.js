import { notFound } from 'next/navigation';
import ErrorMessage from '@/components/ui/ErrorMessage';
import TodoDetailView from '@/components/todos/TodoDetailView';
import todoStyles from '@/components/todos/Todos.module.css';
import { requireAdmin } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';

export default async function AdminTodoSection({ id }) {
  const admin = await requireAdmin();
  const { data: todo, error } = await safeBackendFetch(`/admin/todos/${id}`);

  if (error?.status === 404) notFound();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  return (
    <>
      <p className={todoStyles.notice}>You are viewing this todo as an admin. It is read-only.</p>
      {/* readOnly removes every action button: edit, assign, accept, reject, delete */}
      <TodoDetailView todo={todo} currentUser={admin} readOnly />
    </>
  );
}