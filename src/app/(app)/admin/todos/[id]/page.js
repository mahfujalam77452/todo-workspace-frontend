import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import AdminTodoSection from '@/components/admin/AdminTodoSection';
import { TodoDetailSkeleton } from '@/components/todos/TodoSkeleton';
import styles from '@/components/todos/Todos.module.css';

export const metadata = { title: 'Todo details (admin)' };

export default async function AdminTodoPage({ params }) {
  await requireAdmin();

  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  return (
    <>
      <Link href="/admin/users" className={styles.back}>&larr; Back to users</Link>
      <Suspense fallback={<TodoDetailSkeleton />}>
        <AdminTodoSection id={id} />
      </Suspense>
    </>
  );
}