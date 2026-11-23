import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import BottleneckTodosSection from '@/components/admin/BottleneckTodosSection';

const KINDS = new Set([
  'unassigned',
  'overdue',
  'pending-assignments',
  'high-rejection',
  'overloaded',
  'inactive',
]);

export default async function AdminBottleneckPage({ params }) {
  await requireAdmin();
  const { kind } = await params;
  if (!KINDS.has(kind)) notFound();
  return (
    <>
      <h1>Bottleneck tasks</h1>
      <BottleneckTodosSection kind={kind} />
    </>
  );
}
