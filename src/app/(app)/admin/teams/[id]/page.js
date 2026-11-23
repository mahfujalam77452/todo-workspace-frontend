import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { safeBackendFetch } from '@/lib/server-data';
import ScrumManagement from '@/components/admin/ScrumManagement';
import TeamAnalyticsSection from '@/components/admin/TeamAnalyticsSection';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import styles from '@/components/admin/Admin.module.css';
import dashboardStyles from '@/components/admin/Dashboard.module.css';

export const metadata = { title: 'Team dashboard' };

export default async function AdminTeamDetailPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const { data: team, error } = await safeBackendFetch(`/teams/${id}`);
  if (error?.status === 404) notFound();
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{team.name}</h1>
        <Link href="/admin/teams" className={styles.back}>← Back to teams</Link>
      </div>
      <div className={dashboardStyles.teamDetailSections}>
        <TeamAnalyticsSection fixedTeamId={id} />
        <ScrumManagement teamId={id} />
      </div>
    </>
  );
}
