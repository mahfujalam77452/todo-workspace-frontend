'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Modal from '@/components/ui/Modal';
import LocalTime from '@/components/todos/LocalTime';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';
import { clearTeamCaches } from '@/lib/team-cache';
import TeamForm from './TeamForm';
import styles from './Admin.module.css';

// Deleting a team does not delete its members. They are left without a team.
function memberNote(count) {
  if (count === null) return 'Its members will be left without a team.';
  if (count === 0) return 'It has no members.';
  return `Its ${count} ${count === 1 ? 'member' : 'members'} will be left without a team.`;
}

function TeamRow({ team }) {
  const rename = useAction();
  const remove = useAction();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function closeRename() {
    setRenameOpen(false);
    rename.reset();
  }

  function closeDelete() {
    setDeleteOpen(false);
    remove.reset();
  }

  async function handleRename(name) {
    if (name === team.name) {
      closeRename(); // nothing changed
      return;
    }
    const { ok } = await rename.run(async () => {
      const updated = await apiFetch(`/admin/teams/${team.id}`, { method: 'PATCH', body: { name } });
      await clearTeamCaches([team.id]);
      return updated;
    });
    if (ok) setRenameOpen(false);
  }

  async function handleDelete() {
    const { ok } = await remove.run(async () => {
      await apiFetch(`/admin/teams/${team.id}`, { method: 'DELETE' });
      await clearTeamCaches([team.id]);
    });
    if (ok) setDeleteOpen(false);
  }

  return (
    <tr>
      <td data-label="Team"><Link href={`/admin/teams/${team.id}`}>{team.name}</Link></td>
      <td data-label="Members">
        {team.member_count === null ? (
          '—'
        ) : (
          <Link href={`/admin/users?membership__team=${team.id}`}>{team.member_count}</Link>
        )}
      </td>
      <td data-label="Todos">{team.todo_count ?? '—'}</td>
      <td data-label="Created">
        <LocalTime value={team.created_at} />
      </td>
      <td data-label="Actions">
        <div className={styles.rowActions}>
          <Button variant="secondary" aria-label={`Rename ${team.name}`} onClick={() => setRenameOpen(true)}>
            Rename
          </Button>
          <Button variant="danger" aria-label={`Delete ${team.name}`} onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>

        <Modal open={renameOpen} onClose={closeRename} title="Rename team">
          {renameOpen && (
            <TeamForm
              id={`rename-team-${team.id}`}
              initialName={team.name}
              submitLabel="Save name"
              loading={rename.loading}
              error={rename.error}
              onSubmit={handleRename}
            />
          )}
        </Modal>

        <Modal open={deleteOpen} onClose={closeDelete} title="Delete this team?">
          <div className={styles.form}>
            <p>
              &ldquo;{team.name}&rdquo; will be deleted. {memberNote(team.member_count)} This cannot be undone.
            </p>
            {remove.error && <ErrorMessage message={getErrorMessage(remove.error)} />}
            <div className={styles.rowActions}>
              <Button variant="danger" loading={remove.loading} onClick={handleDelete}>
                Delete team
              </Button>
              <Button variant="secondary" disabled={remove.loading} onClick={closeDelete}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  );
}

export default function TeamsTable({ teams }) {
  return (
    <table className={styles.table}>
      <caption className="visually-hidden">Teams</caption>
      <thead>
        <tr>
          <th scope="col">Team</th>
          <th scope="col">Members</th>
          <th scope="col">Todos</th>
          <th scope="col">Created</th>
          <th scope="col"><span className="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </tbody>
    </table>
  );
}