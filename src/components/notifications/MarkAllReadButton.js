'use client';

import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';

export default function MarkAllReadButton() {
  // useAction refreshes the page data and the bell count after it succeeds.
  const { run, loading, error } = useAction();

  function handleClick() {
    run(() => apiFetch('/notifications/read-all', { method: 'POST', body: {} }));
  }

  return (
    <div>
      <Button variant="secondary" loading={loading} onClick={handleClick}>
        Mark all as read
      </Button>
      {error && <ErrorMessage message={getErrorMessage(error)} />}
    </div>
  );
}