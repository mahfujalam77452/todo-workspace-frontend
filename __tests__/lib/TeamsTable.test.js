import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TeamsTable from '@/components/admin/TeamsTable';
import { apiFetch } from '@/lib/api-client';
import { ApiError } from '@/lib/errors';
import { clearTeamCaches } from '@/lib/team-cache';

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));
jest.mock('@/lib/team-cache', () => ({ clearTeamCaches: jest.fn() }));

// jsdom does not have <dialog>.showModal(), so this fake opens and closes the dialog with the open attribute.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

const team = { id: 1, name: 'Product', member_count: 3, todo_count: 5, created_at: '2026-11-13T09:00:00+06:00' };

beforeEach(() => {
  apiFetch.mockReset();
  clearTeamCaches.mockReset();
});

function openRenameAndSubmit(newName) {
  fireEvent.click(screen.getByRole('button', { name: 'Rename Product' }));
  fireEvent.change(screen.getByLabelText('Team name'), { target: { value: newName } });
  fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
}

describe('TeamsTable', () => {
  it('renames a team and clears the team caches', async () => {
    apiFetch.mockResolvedValue({ id: 1, name: 'Design' });
    render(<TeamsTable teams={[team]} />);

    openRenameAndSubmit('Design');

    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith('/admin/teams/1', { method: 'PATCH', body: { name: 'Design' } }),
    );
    await waitFor(() => expect(clearTeamCaches).toHaveBeenCalledWith([1]));
  });

  it('shows the duplicate name error under the field and does not clear the caches', async () => {
    apiFetch.mockRejectedValue(
      new ApiError(400, 'name: A team with this name already exists.', {
        name: ['A team with this name already exists.'],
      }),
    );
    render(<TeamsTable teams={[team]} />);

    openRenameAndSubmit('Design');

    expect(await screen.findByText('A team with this name already exists.')).toBeInTheDocument();
    expect(clearTeamCaches).not.toHaveBeenCalled();
  });

  it('warns about the members and deletes the team after confirming', async () => {
    apiFetch.mockResolvedValue(null);
    render(<TeamsTable teams={[team]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete Product' }));
    expect(screen.getByText(/Its 3 members will be left without a team/)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled(); // nothing is deleted before the confirmation

    fireEvent.click(screen.getByRole('button', { name: 'Delete team' }));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/admin/teams/1', { method: 'DELETE' }));
    await waitFor(() => expect(clearTeamCaches).toHaveBeenCalledWith([1]));
  });
});