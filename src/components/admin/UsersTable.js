'use client';

import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';
import { revalidateTeamMembers } from '@/lib/revalidate-actions';
import RoleSelect from './RoleSelect';
import TeamSelect from './TeamSelect';
import styles from './Admin.module.css';

function UserRow({ user, teams, isSelf }) {
  const { run, loading, error } = useAction();
  const [role, setRole] = useState(user.role);
  const [teamId, setTeamId] = useState(user.team ? String(user.team.id) : '');
  const [message, setMessage] = useState('');

  // Sends the change. If it fails, the select goes back to its old value and the error is shown.
  async function save(changes, revert) {
    setMessage('');
    const { ok } = await run(() => apiFetch(`/admin/users/${user.id}`, { method: 'PATCH', body: changes }));
    if (!ok) revert();
    return ok;
  }

  async function handleRoleChange(value) {
    const previous = role;
    setRole(value);
    if (await save({ role: value }, () => setRole(previous))) setMessage('Role updated.');
  }

  async function handleTeamChange(value) {
    const previous = teamId;
    setTeamId(value);
    const ok = await save({ team_id: value ? Number(value) : null }, () => setTeamId(previous));
    if (!ok) return;

    setMessage('Team updated.');
    // The assign pickers cache team members. Clear the cache of the old and the new team.
    try {
      await revalidateTeamMembers([Number(previous), Number(value)].filter(Boolean));
    } catch {
      // Ignore: the cache expires by itself after one minute.
    }
  }

  return (
    <tr>
      <td data-label="Name">
        {user.name}
        {isSelf && ' (you)'}
      </td>
      <td data-label="Email">{user.email}</td>
      <td data-label="Role">
        <div className={styles.cellControl}>
          <RoleSelect
            userId={user.id}
            userName={user.name}
            value={role}
            disabled={isSelf || loading}
            onChange={handleRoleChange}
          />
        </div>
      </td>
      <td data-label="Team">
        <div className={styles.cellControl}>
          <TeamSelect
            userId={user.id}
            userName={user.name}
            teams={teams}
            value={teamId}
            disabled={loading}
            onChange={handleTeamChange}
          />
        </div>
      </td>
      <td data-label="Created todos">{user.created_count}</td>
      <td data-label="Assigned todos">{user.assigned_count}</td>
      <td data-label="Status" aria-live="polite">
        {error && <span className={styles.error}>{getErrorMessage(error)}</span>}
        {!error && message && <span className={styles.success}>{message}</span>}
      </td>
    </tr>
  );
}

export default function UsersTable({ users, teams, currentUserId }) {
  return (
    <table className={styles.table}>
      <caption className="visually-hidden">Workspace users</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Team</th>
          <th scope="col">Created</th>
          <th scope="col">Assigned</th>
          <th scope="col"><span className="visually-hidden">Status</span></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} teams={teams} isSelf={user.id === currentUserId} />
        ))}
      </tbody>
    </table>
  );
}