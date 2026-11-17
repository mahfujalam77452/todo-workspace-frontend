import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import { getTeams } from '@/lib/server-data';
import { ADMIN_USER_FILTER_KEYS, getPaging, pickFilters } from '@/lib/todo-query';
import UsersFilters from '@/components/admin/UsersFilters';
import UsersSection from '@/components/admin/UsersSection';
import UsersSkeleton from '@/components/admin/UsersSkeleton';
import styles from '@/components/admin/Admin.module.css';
import ButtonLink from '@/components/ui/ButtonLink';
export const metadata = { title: 'Manage users' };

export default async function AdminUsersPage({ searchParams }) {
  // The layout checks this too, but layouts do not run again on client navigation.
  const admin = await requireAdmin();

  const query = await searchParams;
  const filters = pickFilters(query, ADMIN_USER_FILTER_KEYS);
  const { limit, offset } = getPaging(query);
  const teams = (await getTeams()) ?? [];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Manage users</h1>
        
      </div>

      <UsersFilters teams={teams} />

      <Suspense key={JSON.stringify({ filters, limit, offset })} fallback={<UsersSkeleton />}>
        <UsersSection filters={filters} limit={limit} offset={offset} teams={teams} currentUserId={admin.id} />
      </Suspense>
    </>
  );
}