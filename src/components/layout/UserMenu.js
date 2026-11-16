'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-client';
import styles from './Layout.module.css';

export default function UserMenu() {
  const { user, isAdmin } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore: the server clears the cookies even when the backend call fails.
    }
    // Full page load so all client state is reset.
    window.location.assign('/login');
  }

  return (
    <details className={styles.userMenu}>
      <summary className={styles.summary}>
        <span className={styles.avatar} aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
        <span className={styles.userName}>{user.name}</span>
        <span className="visually-hidden">Account menu</span>
      </summary>

      <div className={styles.panel}>
        <div>
          <strong>{user.name}</strong>
          <p className={styles.muted}>{user.email}</p>
        </div>
        <div className={styles.meta}>
          <Badge tone={isAdmin ? 'info' : 'neutral'}>{isAdmin ? 'Admin' : 'Member'}</Badge>
          <Badge>{user.team ? user.team.name : 'No team'}</Badge>
        </div>
        <Button variant="secondary" loading={loggingOut} onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </details>
  );
}