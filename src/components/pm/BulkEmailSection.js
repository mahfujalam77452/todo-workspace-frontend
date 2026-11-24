import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { safeBackendFetch } from '@/lib/server-data';
import BulkEmailForm from './BulkEmailForm';
import BulkEmailHistory from './BulkEmailHistory';
import styles from './Pm.module.css';

export default async function BulkEmailSection({ user }) {
  if (!user.team) {
    return (
      <EmptyState
        title="You are not in a team"
        description="Ask an admin to add you to a team. Then you can email its members."
      />
    );
  }

  const [membersResult, historyResult] = await Promise.all([
    safeBackendFetch(`/teams/${user.team.id}/members`),
    safeBackendFetch('/pm/bulk-emails?limit=10'),
  ]);
  if (membersResult.error) return <ErrorMessage message={getErrorMessage(membersResult.error)} />;

  // The PM does not email themself.
  const recipients = membersResult.data.filter((member) => member.id !== user.id);

  return (
    <div className={styles.layout}>
      <BulkEmailForm recipients={recipients} />
      <BulkEmailHistory
        emails={historyResult.data?.results ?? []}
        error={historyResult.error ? getErrorMessage(historyResult.error) : ''}
      />
    </div>
  );
}