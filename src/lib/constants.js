export const BACKEND_TIMEOUT_MS = 45000; // Render free tier can take a while to wake up
export const REFRESH_MARGIN_SECONDS = 30; // refresh the access token this long before it expires

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const ROLES = { MEMBER: 'member', ADMIN: 'admin' };

// Todo status and assignment status are two different things. They use different words on purpose.
export const TODO_STATUS_LABELS = {
  pending: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
};

export const ASSIGNMENT_STATUS_LABELS = {
  pending: 'Awaiting response',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const PRIORITY_LABELS = { 1: 'Low', 2: 'Medium', 3: 'High' };