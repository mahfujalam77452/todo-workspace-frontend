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

  const { show } = pickFilters(await searchParams, ['show']);
  const safeShow = ['assigned', 'created'].includes(show) ? show : '';

  return (
    <>
      <Link href="/admin/users" className={styles.back}>&larr; Back to users</Link>
      <Suspense key={safeShow} fallback={<TodoDetailSkeleton />}>
        <UserTodosSection id={id} show={safeShow} />
      </Suspense>
    </>
  );
}