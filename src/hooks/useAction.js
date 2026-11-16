'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/errors';
import { requestNotificationRefresh } from '@/lib/notification-events';

// Runs a mutation (assign, accept, edit ...) and handles loading, error and refreshing the page data.
// Usage: const { ok } = await run(() => apiFetch('/todos', { method: 'POST', body }));
export function useAction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run(action, { refresh = true } = {}) {
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      if (refresh) router.refresh();
      requestNotificationRefresh();
      return { ok: true, result };
    } catch (caught) {
      setError(caught);
      // 409 means the data changed on the server (for example the assignment is no longer pending).
      if (caught instanceof ApiError && caught.status === 409) router.refresh();
      return { ok: false, error: caught };
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, error, reset: () => setError(null) };
}