'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './Dashboard.module.css';

function Trend({ title, items, dateKey }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className={styles.analyticsChart} aria-label={title}>
      <h3>{title}</h3>
      {items.length === 0 ? <p className={styles.clear}>No data available.</p> : (
        <div className={styles.chartBars}>
          {items.map((item) => (
            <div className={styles.chartBarItem} key={item[dateKey]}>
              <span
                className={styles.chartBar}
                style={{ height: `${Math.max((item.count / max) * 100, 4)}%` }}
                title={`${item[dateKey]}: ${item.count}`}
              />
              <span className={styles.chartLabel}>{String(item[dateKey]).slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TeamAnalyticsSection({ fixedTeamId = '' }) {
  const [teams, setTeams] = useState([]);
  const [scrums, setScrums] = useState([]);
  const [teamId, setTeamId] = useState('');
  const [scrumId, setScrumId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fixedTeamId) {
      setTeamId(String(fixedTeamId));
      return;
    }
    apiFetch('/admin/dashboard/teams')
      .then((data) => {
        setTeams(data);
        if (data[0]) setTeamId(String(data[0].id));
      })
      .catch(setError);
  }, [fixedTeamId]);

  useEffect(() => {
    if (!teamId) return;
    Promise.all([
      apiFetch(`/admin/scrums?team=${teamId}`),
      apiFetch(`/admin/dashboard/teams/${teamId}/analytics${scrumId ? `?scrum=${scrumId}` : ''}`),
    ])
      .then(([scrumData, analyticsData]) => {
        setScrums(scrumData);
        setAnalytics(analyticsData);
      })
      .catch(setError);
  }, [teamId, scrumId]);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <section className={styles.panel} aria-labelledby="team-analytics-title">
      <h2 id="team-analytics-title">Team analytics</h2>
      <div className={styles.scrumForm}>
        {!fixedTeamId && (
          <label>
            Team
            <select value={teamId} onChange={(event) => { setTeamId(event.target.value); setScrumId(''); }}>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </label>
        )}
        <label>
          Scrum
          <select value={scrumId} onChange={(event) => setScrumId(event.target.value)}>
            <option value="">All Scrum history</option>
            {scrums.map((scrum) => <option key={scrum.id} value={scrum.id}>{scrum.name}</option>)}
          </select>
        </label>
      </div>
      {analytics && (
        <div className={styles.analyticsGrid}>
          <Trend title="Task creation trend (last 6 months)" items={analytics.task_creation} dateKey="date" />
          <Trend title="Completed tasks per week (last 6 months)" items={analytics.velocity} dateKey="week" />
        </div>
      )}
    </section>
  );
}
