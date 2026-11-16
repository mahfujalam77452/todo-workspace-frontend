import { requireAdmin } from '@/lib/auth';
import ButtonLink from '@/components/ui/ButtonLink';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <h1>Admin</h1>
      <p style={{ margin: 'var(--space-3) 0 var(--space-4)' }}>
        The workspace dashboard is built in Phase 5.
      </p>
      <ButtonLink href="/admin/users">Manage users</ButtonLink>
    </>
  );
}