import { Suspense } from 'react';
import { requirePM } from '@/lib/auth';
import BulkEmailSection from '@/components/pm/BulkEmailSection';
import PanelSkeleton from '@/components/admin/PanelSkeleton';
import styles from '@/components/pm/Pm.module.css';

export const metadata = { title: 'Team mail' };

export default async function TeamMailPage() {
  // Every PM page checks this itself: layouts do not run again on client navigation.
  const user = await requirePM();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Team mail</h1>
      </div>
      {user.team && (
        <p className={styles.intro}>
          Send one message to everyone in <strong>{user.team.name}</strong>. Replies come back to you.
        </p>
      )}

      <Suspense fallback={<PanelSkeleton height="16rem" label="Loading team mail" />}>
        <BulkEmailSection user={user} />
      </Suspense>
    </>
  );
}