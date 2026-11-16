export function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

// Converts an ISO date to the value format of <input type="datetime-local">, in the browser's time zone.
export function toDateTimeLocal(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// A todo is overdue when it has a due date in the past and is not completed.
export function isOverdue(todo) {
  if (!todo.due_date || todo.status === 'completed') return false;
  return new Date(todo.due_date).getTime() < Date.now();
}