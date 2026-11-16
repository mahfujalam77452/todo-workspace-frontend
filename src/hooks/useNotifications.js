'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { ApiError } from '@/lib/errors';
import { NOTIFICATIONS_REFRESH_EVENT } from '@/lib/notification-events';
import { NOTIFICATION_MAX_BACKOFF_MS, NOTIFICATION_POLL_INTERVAL_MS } from '@/lib/constants';
import usePageVisibility from './usePageVisibility';

// After 429/503 wait longer each time (60s, 120s, 240s ... up to 5 minutes).
// If the server sent Retry-After (seconds), wait at least that long.
export function getBackoffDelay(failures, retryAfter) {
  const backoff = Math.min(NOTIFICATION_POLL_INTERVAL_MS * 2 ** failures, NOTIFICATION_MAX_BACKOFF_MS);
  const retryAfterMs = Number(retryAfter) * 1000;
  return Number.isFinite(retryAfterMs) ? Math.max(backoff, retryAfterMs) : backoff;
}

// Polls the unread count every 30 seconds. Pauses while the tab is hidden and loads
// again right away when it becomes visible. Also reloads after an assign/accept/reject/mark-read.
export default function useNotifications() {
  const visible = usePageVisibility();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;

    let cancelled = false;
    let timer = null;
    let failures = 0;

    async function load() {
      clearTimeout(timer);
      let delay = NOTIFICATION_POLL_INTERVAL_MS;

      try {
        const data = await apiFetch('/notifications/unread-count');
        if (!cancelled) setCount(data.count);
        failures = 0;
      } catch (error) {
        // On other errors keep the old count and try again at the normal interval.
        if (error instanceof ApiError && [429, 503].includes(error.status)) {
          failures += 1;
          delay = getBackoffDelay(failures, error.retryAfter);
        }
      }

      if (!cancelled) timer = setTimeout(load, delay);
    }

    load();
    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, load);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, load);
    };
  }, [visible]);

  return { count };
}