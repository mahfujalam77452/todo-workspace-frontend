import { isAllowed } from '@/lib/proxy-allowlist';
import { validateTeam } from '@/lib/validators';

describe('team name validation', () => {
  it('accepts a normal name', () => {
    expect(validateTeam({ name: '  Engineering ' })).toEqual({});
    expect(validateTeam({ name: 'a'.repeat(100) })).toEqual({});
  });

  it('rejects a blank name, a name over 100 characters and control characters', () => {
    expect(validateTeam({ name: '   ' }).name).toBeDefined();
    expect(validateTeam({ name: 'a'.repeat(101) }).name).toBeDefined();
    expect(validateTeam({ name: 'Bad\u0007Name' }).name).toBeDefined();
  });
});

describe('proxy allowlist for admin teams', () => {
  it('allows create, rename and delete, and nothing else', () => {
    expect(isAllowed('/admin/teams', 'POST')).toBe(true);
    expect(isAllowed('/admin/teams/3', 'PATCH')).toBe(true);
    expect(isAllowed('/admin/teams/3', 'DELETE')).toBe(true);

    expect(isAllowed('/admin/teams', 'DELETE')).toBe(false);
    expect(isAllowed('/admin/teams/3', 'PUT')).toBe(false);
    expect(isAllowed('/admin/teams/abc', 'PATCH')).toBe(false);
  });
});