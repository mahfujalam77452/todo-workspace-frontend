import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { pickFilters } from '@/lib/todo-query';
import UserTodosSection from '@/components/admin/UserTodosSection';
import { TodoDetailSkeleton } from '@/components/todos/TodoSkeleton';
import styles from '@/components/todos/Todos.module.css';

export const metadata = { title: 'User todos' };

export default async function AdminUserPage({ params, searchParams }) {
  await requireAdmin();

  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const filters = pickFilters(await searchParams, ['show', 'scrum', 'category', 'from', 'to', 'relation']);
  const { show = '', scrum = '', category = '', from = '', to = '', relation = '' } = filters;
  const safeShow = ['assigned', 'created'].includes(show) ? show : '';
  const safeRelation = ['assigned', 'created'].includes(relation) ? relation : safeShow;

  return (
    <>
      <Link href="/admin/users" className={styles.back}>&larr; Back to users</Link>
      <Suspense key={JSON.stringify({ safeShow, scrum, category, from, to, safeRelation })} fallback={<TodoDetailSkeleton />}>
        <UserTodosSection
          id={id}
          show={safeShow}
          scrum={scrum}
          category={category}
          from={from}
          to={to}
          relation={safeRelation}
        />
      </Suspense>
    </>
  );
}