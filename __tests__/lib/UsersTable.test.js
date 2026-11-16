import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersTable from '@/components/admin/UsersTable';
import { apiFetch } from '@/lib/api-client';
import { ApiError } from '@/lib/errors';

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));
jest.mock('@/lib/revalidate-actions', () => ({ revalidateTeamMembers: jest.fn() }));

const teams = [
  { id: 1, name: 'Product' },
  { id: 2, name: 'Design' },
];

const users = [
  { id: 1, name: 'Ayesha', email: 'ayesha@example.com', role: 'admin', team: teams[0], created_count: 3, assigned_count: 2 },
  { id: 2, name: 'Rahim', email: 'rahim@example.com', role: 'admin', team: null, created_count: 0, assigned_count: 1 },
];

function renderTable() {
  render(<UsersTable users={users} teams={teams} currentUserId={1} />);
}

beforeEach(() => apiFetch.mockReset());

describe('UsersTable', () => {
  it("disables the role select on the admin's own row only", () => {
    renderTable();
    expect(screen.getByLabelText('Role for Ayesha')).toBeDisabled();
    expect(screen.getByLabelText('Role for Rahim')).toBeEnabled();
  });

  it('sends the new role to the API', async () => {
    apiFetch.mockResolvedValue({});
    renderTable();

    fireEvent.change(screen.getByLabelText('Role for Rahim'), { target: { value: 'member' } });

    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith('/admin/users/2', { method: 'PATCH', body: { role: 'member' } }),
    );
    expect(await screen.findByText('Role updated.')).toBeInTheDocument();
  });

  it('shows the backend message and restores the role when the last admin is demoted', async () => {
    apiFetch.mockRejectedValue(new ApiError(409, 'The last admin cannot be demoted.'));
    renderTable();

    const select = screen.getByLabelText('Role for Rahim');
    fireEvent.change(select, { target: { value: 'member' } });

    expect(await screen.findByText('The last admin cannot be demoted.')).toBeInTheDocument();
    expect(select).toHaveValue('admin');
  });
});