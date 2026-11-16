import { Suspense } from 'react';
import { requireUser } from '@/lib/auth';
import { getCategories, getTeamMembers } from '@/lib/server-data';
import { getPaging, pickFilters } from '@/lib/todo-query';
import CreateTodoModal from '@/components/todos/CreateTodoModal';
import TodoFilters from '@/components/todos/TodoFilters';
import TodoListSection from '@/components/todos/TodoListSection';
import TodoSkeleton from '@/components/todos/TodoSkeleton';
import TodoTabs from '@/components/todos/TodoTabs';
import styles from '@/components/todos/Todos.module.css';

export const metadata = { title: 'Todos' };

export default async function TodosPage({ searchParams }) {
  const user = await requireUser();

  // Filters and paging come from the URL, so the page can be bookmarked and shared.
  const query = await searchParams;
  const filters = pickFilters(query);
  const { limit, offset } = getPaging(query);

  // Both are cached. null means the request failed, so the form shows what it can.
  const [categories, members] = await Promise.all([
    getCategories(),
    user.team ? getTeamMembers(user.team.id) : [],
  ]);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Todos</h1>
        <CreateTodoModal categories={categories ?? []} members={members} currentUser={user} />
      </div>

      <TodoTabs filters={filters} />
      <TodoFilters categories={categories ?? []} />

      {/* The key changes with the URL, so the skeleton shows again while a new filter loads */}
      <Suspense key={JSON.stringify({ filters, limit, offset })} fallback={<TodoSkeleton />}>
        <TodoListSection filters={filters} limit={limit} offset={offset} />
      </Suspense>
    </>
  );
}