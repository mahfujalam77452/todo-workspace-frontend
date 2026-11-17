import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import ButtonLink from '@/components/ui/ButtonLink';
import CreateTeamModal from '@/components/admin/CreateTeamModal';
import PanelSkeleton from '@/components/admin/PanelSkeleton';
import TeamsAdminSection from '@/components/admin/TeamsAdminSection';
import styles from '@/components/admin/Admin.module.css';

export const metadata = { title: 'Manage teams' };

export default async function AdminTeamsPage() {
  // The layout checks this too, but layouts do not run again on client navigation.
  await requireAdmin();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Manage teams</h1>
        <div className={styles.rowActions}>
          
          <CreateTeamModal />
        </div>
      </div>

      <Suspense fallback={<PanelSkeleton height="12rem" label="Loading teams" />}>
        <TeamsAdminSection />
      </Suspense>
    </>
  );
}