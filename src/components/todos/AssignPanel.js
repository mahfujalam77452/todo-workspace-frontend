'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getAssignErrorMessage } from '@/lib/errors';
import AssignPicker from './AssignPicker';
import styles from './Todos.module.css';

// Shown to the assigner: assign the todo, or assign it to someone else.
export default function AssignPanel({ todo, members, team, currentUser }) {
  const { run, loading, error } = useAction();
  const [assignee, setAssignee] = useState('');

  async function handleAssign() {
    if (!assignee) return;
    const { ok } = await run(() =>
      apiFetch(`/todos/${todo.id}/assign`, { method: 'POST', body: { assignee_id: Number(assignee) } }),
    );
    if (ok) setAssignee('');
  }

  return (
    <section className={styles.panel} aria-labelledby="assign-title">
      <h2 id="assign-title">{todo.assignee ? 'Assign to someone else' : 'Assign this todo'}</h2>

      {team ? (
        <FormField label="Assign to" htmlFor="assign-to">
          <AssignPicker
            id="assign-to"
            value={assignee}
            onChange={setAssignee}
            members={members}
            team={team}
            currentUser={currentUser}
            allowUnassigned={false}
            disabled={loading}
          />
        </FormField>
      ) : (
        <AssignPicker team={team} currentUser={currentUser} />
      )}

      {error && <ErrorMessage message={getAssignErrorMessage(error)} />}

      <Button loading={loading} disabled={!assignee || !team} onClick={handleAssign}>
        Assign
      </Button>
    </section>
  );
}