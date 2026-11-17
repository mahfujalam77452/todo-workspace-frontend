import { fireEvent, render, screen } from '@testing-library/react';
import ErrorView from '@/components/ui/ErrorView';

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }));

beforeEach(() => {
  // ErrorView logs the error, keep the test output clean.
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ErrorView', () => {
  it('shows a friendly message and the error reference, but not the technical message', () => {
    const error = Object.assign(new Error('database exploded'), { digest: 'abc123' });
    render(<ErrorView error={error} reset={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('Reference: abc123')).toBeInTheDocument();
    expect(screen.queryByText(/database exploded/)).not.toBeInTheDocument();
  });

  it('calls reset when the user clicks Try again', () => {
    const reset = jest.fn();
    render(<ErrorView error={new Error('x')} reset={reset} homeHref="/todos" homeLabel="Go to my todos" />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Go to my todos' })).toHaveAttribute('href', '/todos');
  });
});