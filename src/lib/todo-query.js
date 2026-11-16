import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';

// Only these URL params are sent to the backend.
export const FILTER_KEYS = [
  'relation',
  'status',
  'assignment_status',
  'priority',
  'category',
  'overdue',
  'search',
  'ordering',
];

export const ADMIN_USER_FILTER_KEYS = ['role', 'membership__team', 'search'];

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

// Keeps only the allowed keys and drops empty values. Works for any page, pass its own keys.
export function pickFilters(searchParams = {}, keys = FILTER_KEYS) {
  const filters = {};
  for (const key of keys) {
    const value = String(first(searchParams[key]) ?? '').trim();
    if (value) filters[key] = value;
  }
  return filters;
}

export function getPaging(searchParams = {}) {
  const limit = parseInt(first(searchParams.limit), 10);
  const offset = parseInt(first(searchParams.offset), 10);

  return {
    limit: Number.isInteger(limit) ? Math.min(Math.max(limit, 1), MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE,
    offset: Number.isInteger(offset) && offset > 0 ? offset : 0,
  };
}

// Despite the name it works for every paginated endpoint: filters + limit + offset.
export function buildTodoQuery(filters, { limit, offset }) {
  const query = new URLSearchParams(filters);
  query.set('limit', String(limit));
  query.set('offset', String(offset));
  return query.toString();
}

// Link to the list page with some filters changed. Used by the tabs.
export function buildListHref(filters, changes = {}) {
  const merged = { ...filters, ...changes };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `/todos?${text}` : '/todos';
}