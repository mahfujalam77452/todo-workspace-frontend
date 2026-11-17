// How the user activity table can be sorted. "name" sorts A to Z, all others biggest first.
export const USER_SORTS = {
  name: { label: 'Name (A to Z)' },
  assigned: { label: 'Most assigned', field: 'assigned_count' },
  completed: { label: 'Most completed', field: 'completed_count' },
  rejected: { label: 'Most rejected', field: 'rejected_count' },
  completion: { label: 'Highest completion rate', field: 'completion_rate' },
  rejection: { label: 'Highest rejection rate', field: 'rejection_rate' },
};

export function sortUsers(users, sortKey) {
  const sort = USER_SORTS[sortKey];
  const copy = [...users];

  if (!sort || !sort.field) {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy.sort((a, b) => b[sort.field] - a[sort.field] || a.name.localeCompare(b.name));
}

// "assignment_accepted" -> "Assignment accepted"
export function formatActivityType(type) {
  const text = String(type || 'update').replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}