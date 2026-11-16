import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TodoDetailSection from '@/components/todos/TodoDetailSection';
import { TodoDetailSkeleton } from '@/components/todos/TodoSkeleton';
import styles from '@/components/todos/Todos.module.css';

export const metadata = { title: 'Todo details' };

export default async function TodoDetailsPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  return (
    <>
      <Link href="/todos" className={styles.back}>&larr; Back to todos</Link>
      <Suspense fallback={<TodoDetailSkeleton />}>
        <TodoDetailSection id={id} />
      </Suspense>
    </>
  );
}