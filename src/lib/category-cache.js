import { revalidateCategories } from './revalidate-actions';

// Clears the cached category list after a change. If this fails, the cache simply
// expires by itself after 5 minutes, so the change itself is still successful.
export async function clearCategoryCaches() {
  try {
    await revalidateCategories();
  } catch {
    // Ignore: the cache expires by itself.
  }
}