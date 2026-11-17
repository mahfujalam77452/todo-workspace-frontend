import { isAllowed } from '@/lib/proxy-allowlist';
import { validateCategory } from '@/lib/validators';

describe('category name validation', () => {
  it('accepts a normal name up to 50 characters', () => {
    expect(validateCategory({ name: '  Work ' })).toEqual({});
    expect(validateCategory({ name: 'a'.repeat(50) })).toEqual({});
  });

  it('rejects a blank name, a name over 50 characters and control characters', () => {
    expect(validateCategory({ name: '   ' }).name).toBeDefined();
    expect(validateCategory({ name: 'a'.repeat(51) }).name).toBeDefined();
    expect(validateCategory({ name: 'Bad\u0007Name' }).name).toBeDefined();
  });
});

describe('proxy allowlist for categories', () => {
  it('allows list, create, rename and delete, and nothing else', () => {
    expect(isAllowed('/categories', 'GET')).toBe(true);
    expect(isAllowed('/categories', 'POST')).toBe(true);
    expect(isAllowed('/categories/5', 'PATCH')).toBe(true);
    expect(isAllowed('/categories/5', 'DELETE')).toBe(true);

    expect(isAllowed('/categories', 'DELETE')).toBe(false);
    expect(isAllowed('/categories/5', 'PUT')).toBe(false);
    expect(isAllowed('/categories/abc', 'PATCH')).toBe(false);
  });
});