import { requireAdmin } from '@/lib/auth';
import AdminSubNav from '@/components/admin/AdminSubNav';

// Layouts do not re-render on client navigation, so every admin page also calls requireAdmin().
export default async function AdminLayout({ children }) {
  await requireAdmin();

  return (
    <>
      <AdminSubNav />
      {children}
    </>
  );
}