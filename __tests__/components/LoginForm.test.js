import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import { apiFetch } from '@/lib/api-client';
import { ApiError } from '@/lib/errors';

jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), refresh: jest.fn() }),
}));

function fillAndSubmit(email, password) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
}

describe('LoginForm', () => {
  beforeEach(() => apiFetch.mockReset());

  it('shows field errors and does not call the API when the form is invalid', async () => {
    render(<LoginForm />);
    fillAndSubmit('bad-email', '');

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Enter your password.')).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('shows a clear message when the credentials are wrong', async () => {
    apiFetch.mockRejectedValue(new ApiError(401, 'Invalid credentials'));
    render(<LoginForm />);
    fillAndSubmit('a@example.com', 'wrong-password');

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
  });
});