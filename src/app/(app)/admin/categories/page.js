import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import CategoriesSection from '@/components/admin/CategoriesSection';
import CreateCategoryModal from '@/components/admin/CreateCategoryModal';
import PanelSkeleton from '@/components/admin/PanelSkeleton';
import styles from '@/components/admin/Admin.module.css';

export const metadata = { title: 'Manage categories' };

export default async function AdminCategoriesPage() {
  // The layout checks this too, but layouts do not run again on client navigation.
  await requireAdmin();

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Manage categories</h1>
        <CreateCategoryModal />
      </div>

      <Suspense fallback={<PanelSkeleton height="12rem" label="Loading categories" />}>
        <CategoriesSection />
      </Suspense>
    </>
  );
}