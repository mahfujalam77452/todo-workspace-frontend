import { act, render, screen } from '@testing-library/react';
import NotificationBell from '@/components/notifications/NotificationBell';
import { getBackoffDelay } from '@/hooks/useNotifications';
import { apiFetch } from '@/lib/api-client';

jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));

function defineVisibility(state) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
}

async function changeVisibility(state) {
  await act(async () => {
    defineVisibility(state);
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

async function renderBell(count) {
  apiFetch.mockResolvedValue({ count });
  render(<NotificationBell />);
  await act(async () => {}); // let the first request finish
}

beforeEach(() => {
  jest.useFakeTimers();
  apiFetch.mockReset();
  defineVisibility('visible');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('NotificationBell', () => {
  it('shows the unread count in the badge', async () => {
    await renderBell(3);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notifications, 3 unread' })).toBeInTheDocument();
  });

  it('shows 99+ when there are more than 99 unread', async () => {
    await renderBell(150);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('stops polling while the tab is hidden and loads again when it is visible', async () => {
    await renderBell(1);
    expect(apiFetch).toHaveBeenCalledTimes(1);

    await changeVisibility('hidden');
    apiFetch.mockClear();
    await act(async () => {
      jest.advanceTimersByTime(120000);
    });
    expect(apiFetch).not.toHaveBeenCalled();

    await changeVisibility('visible');
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});

describe('getBackoffDelay', () => {
  it('waits longer after each failure, up to 5 minutes, and respects Retry-After', () => {
    expect(getBackoffDelay(1)).toBe(60000);
    expect(getBackoffDelay(2)).toBe(120000);
    expect(getBackoffDelay(10)).toBe(300000);
    expect(getBackoffDelay(1, '120')).toBe(120000);
  });
});