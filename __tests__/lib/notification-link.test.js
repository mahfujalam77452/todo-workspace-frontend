import { getNotificationHref } from '@/lib/notification-link';

describe('getNotificationHref', () => {
  it('builds the todo page link from todo_id and ignores the API link', () => {
    const notification = { todo_id: 10, link: '/api/todos/10' };
    expect(getNotificationHref(notification)).toBe('/todos/10');
  });

  it('returns null when there is no valid todo id', () => {
    expect(getNotificationHref({ todo_id: null, link: '/api/todos/10' })).toBeNull();
    expect(getNotificationHref({ todo_id: '7abc' })).toBeNull();
    expect(getNotificationHref(undefined)).toBeNull();
  });
});