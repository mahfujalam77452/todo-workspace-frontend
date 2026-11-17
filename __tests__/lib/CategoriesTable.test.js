import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CategoriesTable from '@/components/admin/CategoriesTable';
import { apiFetch } from '@/lib/api-client';
import { clearCategoryCaches } from '@/lib/category-cache';

jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));
jest.mock('@/lib/category-cache', () => ({ clearCategoryCaches: jest.fn() }));

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

const category = { id: 4, name: 'Work', created_at: '2026-11-13T09:00:00+06:00' };

beforeEach(() => {
  apiFetch.mockReset();
  clearCategoryCaches.mockReset();
});

function openRenameAndSubmit(newName) {
  fireEvent.click(screen.getByRole('button', { name: 'Rename Work' }));
  fireEvent.change(screen.getByLabelText('Category name'), { target: { value: newName } });
  fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
}

describe('CategoriesTable', () => {
  it('renames a category and clears the category cache', async () => {
    apiFetch.mockResolvedValue({ id: 4, name: 'Office' });
    render(<CategoriesTable categories={[category]} />);

    openRenameAndSubmit('Office');

    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith('/categories/4', { method: 'PATCH', body: { name: 'Office' } }),
    );
    await waitFor(() => expect(clearCategoryCaches).toHaveBeenCalled());
  });

  it('does not send a name that is longer than 50 characters', async () => {
    render(<CategoriesTable categories={[category]} />);

    openRenameAndSubmit('a'.repeat(51));

    expect(await screen.findByText('Category name must be 50 characters or fewer.')).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('explains what happens to todos and deletes only after confirming', async () => {
    apiFetch.mockResolvedValue(null);
    render(<CategoriesTable categories={[category]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete Work' }));
    expect(screen.getByText(/their category will be cleared/)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled(); // nothing is deleted before the confirmation

    fireEvent.click(screen.getByRole('button', { name: 'Delete category' }));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/categories/4', { method: 'DELETE' }));
    await waitFor(() => expect(clearCategoryCaches).toHaveBeenCalled());
  });
});