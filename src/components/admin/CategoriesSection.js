import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { CATEGORIES_FETCH_OPTIONS, safeBackendFetch } from '@/lib/server-data';
import CategoriesTable from './CategoriesTable';

export default async function CategoriesSection() {
  const { data, error } = await safeBackendFetch('/categories', CATEGORIES_FETCH_OPTIONS);
  if (error) return <ErrorMessage message={getErrorMessage(error)} />;

  if (data.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Create the first category with the New category button. Members can then pick it when they create a todo."
      />
    );
  }

  const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
  return <CategoriesTable categories={sorted} />;
}