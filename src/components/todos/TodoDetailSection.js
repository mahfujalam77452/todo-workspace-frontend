import { notFound } from 'next/navigation';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { requireUser } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errors';
import { getCategories, getTeamMembers, safeBackendFetch } from '@/lib/server-data';
import TodoDetailView from './TodoDetailView';

export default async function TodoDetailSection({ id }) {
  const user = await requireUser();
  const { data: todo, error } = await safeBackendFetch(`/todos/${id}`);

  // The API returns 404 for a missing todo and for a todo this user may not see.
  if (error?.status === 404) notFound();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  const isAssignee = todo.assignee?.id === user.id;
  const isAssigner = todo.assigner?.id === user.id;

  // Load only what this user needs: categories for the edit form, teammates for the assign panel.
  const [categories, members] = await Promise.all([
    isAssignee ? getCategories() : [],
    isAssigner && user.team ? getTeamMembers(user.team.id) : [],
  ]);

  return <TodoDetailView todo={todo} currentUser={user} categories={categories ?? []} members={members} />;
}