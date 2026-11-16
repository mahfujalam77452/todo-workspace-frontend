'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';
import styles from './Todos.module.css';

// Shown to the assignee. The buttons appear only while the assignment is pending.
// The component stays mounted after a 409, so the error message does not disappear when the page refreshes.
export default function AcceptRejectBar({ todo }) {
  const { run, loading, error } = useAction();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState('');

  const pending = todo.assignment_status === 'pending';

  async function respond(action) {
    const body = action === 'reject' && reason.trim() ? { reason: reason.trim() } : {};
    setBusy(action);
    const { ok } = await run(() => apiFetch(`/todos/${todo.id}/${action}`, { method: 'POST', body }));
    setBusy('');
    if (ok) setRejecting(false);
  }

  if (!pending && !error) return null;

  return (
    <section className={styles.panel} aria-labelledby="respond-title">
      {pending && (
        <>
          <h2 id="respond-title">Respond to this assignment</h2>
          <p>{todo.assigner.name} assigned this todo to you. Do you accept it?</p>

          {rejecting ? (
            <>
              <FormField label="Reason (optional)" htmlFor="reject-reason" hint="Up to 250 characters.">
                <Input
                  id="reject-reason"
                  maxLength={250}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </FormField>
              <div className={styles.actions}>
                <Button variant="danger" loading={busy === 'reject'} disabled={loading} onClick={() => respond('reject')}>
                  Confirm reject
                </Button>
                <Button variant="ghost" disabled={loading} onClick={() => setRejecting(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.actions}>
              <Button loading={busy === 'accept'} disabled={loading} onClick={() => respond('accept')}>
                Accept
              </Button>
              <Button variant="secondary" disabled={loading} onClick={() => setRejecting(true)}>
                Reject
              </Button>
            </div>
          )}
        </>
      )}

      {error && <ErrorMessage message={getErrorMessage(error)} />}
    </section>
  );
}