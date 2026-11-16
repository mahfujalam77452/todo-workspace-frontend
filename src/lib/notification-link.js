// Builds the todo page link from todo_id.
// The API "link" field is an API path (/api/todos/10), so it is never used in the browser.
export function getNotificationHref(notification) {
  const id = Number(notification?.todo_id);
  return Number.isInteger(id) && id > 0 ? `/todos/${id}` : null;
}