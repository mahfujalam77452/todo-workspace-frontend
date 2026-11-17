import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { sortUsers } from '@/lib/dashboard';
import { getErrorMessage } from '@/lib/errors';
import { getDashboardUsers } from '@/lib/server-data';
import UserActivityTable from './UserActivityTable';

export default async function UserActivitySection({ search, sort }) {
  const { data, error } = await getDashboardUsers(search);
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  if (data.length === 0) {
    return <EmptyState title="No users found" description="Try a different search." />;
  }

  return <UserActivityTable users={sortUsers(data, sort)} />;
}