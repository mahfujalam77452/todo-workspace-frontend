import { requireUser } from '@/lib/auth';

export const metadata = { title: 'Todos' };

export default async function TodosPage() {
  const user = await requireUser();

  return (
    <>
      <h1>Todos</h1>
      <p>Hello, {user.name}. The todo list is built in Phase 3.</p>
    </>
  );
}