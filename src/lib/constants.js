export const BACKEND_TIMEOUT_MS = 45000; // Render free tier can take a while to wake up
export const REFRESH_MARGIN_SECONDS = 30; // refresh the access token this long before it expires

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const ROLES = { MEMBER: 'member', PM: 'pm', ADMIN: 'admin' };

export const ROLE_LABELS = { member: 'Member', pm: 'Project Manager', admin: 'Admin' };

export const ASSIGNMENT_STATUS_LABELS = {
  pending: 'Awaiting response',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const PRIORITY_LABELS = { 1: 'Low', 2: 'Medium', 3: 'High' };

export const NOTIFICATION_TYPE_LABELS = {
  assigned: 'Assigned',
  accepted: 'Accepted',
  rejected: 'Rejected',
  role_changed: 'Role changed',
};

export const NOTIFICATION_POLL_INTERVAL_MS = 30000;
export const NOTIFICATION_MAX_BACKOFF_MS = 5 * 60 * 1000;
export const NOTIFICATION_RECENT_DAYS = 7;