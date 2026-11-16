import { validateLogin, validateRegister } from '@/lib/validators';

describe('validators', () => {
  it('accepts valid login values', () => {
    expect(validateLogin({ email: 'a@example.com', password: 'secret' })).toEqual({});
  });

  it('rejects an invalid email and an empty password on login', () => {
    const errors = validateLogin({ email: 'not-an-email', password: '' });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('checks name length and password length on register', () => {
    const errors = validateRegister({ name: ' '.repeat(3), email: 'a@example.com', password: 'short' });
    expect(errors.name).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(errors.email).toBeUndefined();

    const tooLong = validateRegister({ name: 'a'.repeat(151), email: 'a@example.com', password: 'longenough' });
    expect(tooLong.name).toBeDefined();
  });
});