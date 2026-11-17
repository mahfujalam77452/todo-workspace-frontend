import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import { USER_SORTS } from '@/lib/dashboard';
import { pickFilters } from '@/lib/todo-query';
import ButtonLink from '@/components/ui/ButtonLink';
import ActivitySection from '@/components/admin/ActivitySection';
import BottleneckSection from '@/components/admin/BottleneckSection';
import DashboardUserControls from '@/components/admin/DashboardUserControls';
import OverviewSection from '@/components/admin/OverviewSection';
import PanelSkeleton from '@/components/admin/PanelSkeleton';
import TeamsSection from '@/components/admin/TeamsSection';
import UserActivitySection from '@/components/admin/UserActivitySection';
import adminStyles from '@/components/admin/Admin.module.css';
import styles from '@/components/admin/Dashboard.module.css';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage({ searchParams }) {
  await requireAdmin();

  const query = await searchParams;
  const { userSearch = '', sort = '' } = pickFilters(query, ['userSearch', 'sort']);
  const safeSort = USER_SORTS[sort] ? sort : 'name';

  return (
    <>
      <div className={adminStyles.pageHeader}>
        <h1>Workspace dashboard</h1>
        <div className={adminStyles.rowActions}>
          
        </div>
      </div>

      <Suspense fallback={<PanelSkeleton height="16rem" label="Loading overview" />}>
        <OverviewSection />
      </Suspense>

      <div className={styles.twoCols}>
        <Suspense fallback={<PanelSkeleton label="Loading bottlenecks" />}>
          <BottleneckSection />
        </Suspense>
        <Suspense fallback={<PanelSkeleton label="Loading teams" />}>
          <TeamsSection />
        </Suspense>
      </div>

      <section className={styles.sectionBlock} aria-labelledby="user-activity-title">
        <h2 id="user-activity-title">User activity</h2>
        <DashboardUserControls />
        <Suspense
          key={JSON.stringify({ userSearch, safeSort })}
          fallback={<PanelSkeleton height="14rem" label="Loading user activity" />}
        >
          <UserActivitySection search={userSearch} sort={safeSort} />
        </Suspense>
      </section>

      <section className={styles.sectionBlock} aria-labelledby="activity-title">
        <h2 id="activity-title">Recent activity</h2>
        <div className={styles.panel}>
          <Suspense fallback={<PanelSkeleton height="12rem" label="Loading activity" />}>
            <ActivitySection />
          </Suspense>
        </div>
      </section>
    </>
  );
}