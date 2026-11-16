// Phase 4 adds a notification bell that listens to this event and reloads the unread count.
export const NOTIFICATIONS_REFRESH_EVENT = 'notifications:refresh';

export function requestNotificationRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NOTIFICATIONS_REFRESH_EVENT));
  }
}