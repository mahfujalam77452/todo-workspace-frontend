/** @jest-environment node */
import { cookies } from 'next/headers';
import { backendFetch } from '@/lib/backend';
import { requireUser, requireAdmin } from '@/lib/auth';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('@/lib/backend', () => ({ backendFetch: jest.fn() }));
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
// React.cache only exists in the server build of React, so use a plain function in tests.
jest.mock('react', () => ({ ...jest.requireActual('react'), cache: (fn) => fn }));

function setCookie(hasToken) {
  cookies.mockResolvedValue({ get: () => (hasToken ? { value: 'token' } : undefined) });
}

describe('auth guards', () => {
  it('requireUser redirects to /login without a session', async () => {
    setCookie(false);
    await expect(requireUser()).rejects.toThrow('REDIRECT:/login');
  });

  it('requireAdmin redirects a member to /todos', async () => {
    setCookie(true);
    backendFetch.mockResolvedValue({ id: 1, role: 'member' });
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/todos');
  });

  it('requireAdmin returns the user when the role is admin', async () => {
    setCookie(true);
    backendFetch.mockResolvedValue({ id: 2, role: 'admin' });
    await expect(requireAdmin()).resolves.toEqual({ id: 2, role: 'admin' });
  });
});