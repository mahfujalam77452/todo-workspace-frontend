import { requireAdmin } from '@/lib/auth';

// Layouts do not re-render on client navigation, so every admin page also calls requireAdmin().
export default async function AdminLayout({ children }) {
  await requireAdmin();
  return children;
}