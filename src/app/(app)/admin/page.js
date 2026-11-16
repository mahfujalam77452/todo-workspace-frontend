import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <h1>Admin</h1>
      <p>The admin tools are built in Phase 4 and 5.</p>
    </>
  );
}