import { render, screen } from '@testing-library/react';
import NavLinks from '@/components/layout/NavLinks';
import { AuthProvider } from '@/context/AuthContext';

jest.mock('next/navigation', () => ({ usePathname: () => '/todos' }));

function renderNav(role) {
  const user = { id: 1, name: 'Ayesha', email: 'a@example.com', role, team: null };
  render(
    <AuthProvider initialUser={user}>
      <NavLinks />
    </AuthProvider>,
  );
}

describe('NavLinks', () => {
  it('hides the Admin link from members', () => {
    renderNav('member');
    expect(screen.getByRole('link', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('shows the Admin link to admins', () => {
    renderNav('admin');
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });
});