'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { clearTeamCaches } from '@/lib/team-cache';
import TeamForm from './TeamForm';

export default function CreateTeamModal() {
  const [open, setOpen] = useState(false);
  const { run, loading, error, reset } = useAction();

  function close() {
    setOpen(false);
    reset();
  }

  async function handleCreate(name) {
    const { ok } = await run(async () => {
      const team = await apiFetch('/admin/teams', { method: 'POST', body: { name } });
      // Clear the caches before the page refreshes, so the new team shows up at once.
      await clearTeamCaches([team.id]);
      return team;
    });
    if (ok) setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New team</Button>
      <Modal open={open} onClose={close} title="New team">
        {/* The form is mounted only while the modal is open, so it is empty every time */}
        {open && (
          <TeamForm
            id="new-team-name"
            submitLabel="Create team"
            loading={loading}
            error={error}
            onSubmit={handleCreate}
          />
        )}
      </Modal>
    </>
  );
}