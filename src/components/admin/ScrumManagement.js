'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './Dashboard.module.css';

export default function ScrumManagement({ teamId = '' }) {
  const [scrums, setScrums] = useState([]);
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState('');
  const [settings, setSettings] = useState({
    overloaded_user_threshold: 5,
    overdue_alert_threshold: 0,
  });
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setScrums(await apiFetch(teamId ? `/admin/scrums?team=${teamId}` : '/admin/scrums'));
      setTeams(await apiFetch('/teams'));
      setSettings(await apiFetch('/admin/dashboard/settings'));
    } catch (loadError) {
      setError(loadError);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (teamId) setTeam(String(teamId));
  }, [teamId]);

  async function createScrum(event) {
    event.preventDefault();
    try {
      await apiFetch('/admin/scrums', { method: 'POST', body: { team } });
      await load();
    } catch (createError) {
      setError(createError);
    }
  }

  async function endScrum(id) {
    try {
      await apiFetch(`/admin/scrums/${id}/end`, { method: 'POST', body: {} });
      await load();
    } catch (endError) {
      setError(endError);
    }
  }

  async function startScrum(id) {
    try {
      await apiFetch(`/admin/scrums/${id}/start`, { method: 'POST', body: {} });
      await load();
    } catch (startError) {
      setError(startError);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    try {
      const updated = await apiFetch('/admin/dashboard/settings', {
        method: 'PATCH',
        body: {
          overloaded_user_threshold: Number(settings.overloaded_user_threshold),
          overdue_alert_threshold: Number(settings.overdue_alert_threshold),
        },
      });
      setSettings(updated);
    } catch (settingsError) {
      setError(settingsError);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="scrum-management-title">
      <h2 id="scrum-management-title">Scrum management</h2>
      {error && <ErrorMessage message={error.message} />}
      {!teamId && (
        <form onSubmit={createScrum} className={styles.scrumForm}>
          <select value={team} onChange={(event) => setTeam(event.target.value)} required aria-label="Team">
            <option value="">Select a team</option>
            {teams.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <Button type="submit">Create scrum</Button>
        </form>
      )}
      {teamId && (
        <form onSubmit={createScrum} className={styles.scrumForm}>
          <Button type="submit">Create scrum</Button>
        </form>
      )}
      <form onSubmit={saveSettings} className={styles.scrumForm}>
        <label>
          Overloaded-user threshold
          <input
            type="number"
            min="1"
            value={settings.overloaded_user_threshold}
            onChange={(event) => setSettings({ ...settings, overloaded_user_threshold: event.target.value })}
          />
        </label>
        <label>
          Overdue alert threshold
          <input
            type="number"
            min="0"
            value={settings.overdue_alert_threshold}
            onChange={(event) => setSettings({ ...settings, overdue_alert_threshold: event.target.value })}
          />
        </label>
        <Button type="submit">Save thresholds</Button>
      </form>
      <ul className={styles.scrumList}>
        {scrums.map((scrum) => (
          <li key={scrum.id}>
            <span>{scrum.team_name}: {scrum.name} ({scrum.status})</span>
            {scrum.status === 'created' && <Button type="button" onClick={() => startScrum(scrum.id)}>Start</Button>}
            {scrum.status === 'running' && <Button type="button" onClick={() => endScrum(scrum.id)}>End</Button>}
            {scrum.status === 'ended' && <Button type="button" disabled>Finished</Button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
