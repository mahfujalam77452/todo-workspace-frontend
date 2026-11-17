'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Modal from '@/components/ui/Modal';
import LocalTime from '@/components/todos/LocalTime';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { clearCategoryCaches } from '@/lib/category-cache';
import { getErrorMessage } from '@/lib/errors';
import CategoryForm from './CategoryForm';
import styles from './Admin.module.css';

function CategoryRow({ category }) {
  const rename = useAction();
  const remove = useAction();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function closeRename() {
    setRenameOpen(false);
    rename.reset();
  }

  function closeDelete() {
    setDeleteOpen(false);
    remove.reset();
  }

  async function handleRename(name) {
    if (name === category.name) {
      closeRename(); // nothing changed
      return;
    }
    const { ok } = await rename.run(async () => {
      const updated = await apiFetch(`/categories/${category.id}`, { method: 'PATCH', body: { name } });
      await clearCategoryCaches();
      return updated;
    });
    if (ok) setRenameOpen(false);
  }

  async function handleDelete() {
    const { ok } = await remove.run(async () => {
      await apiFetch(`/categories/${category.id}`, { method: 'DELETE' });
      await clearCategoryCaches();
    });
    if (ok) setDeleteOpen(false);
  }

  return (
    <tr>
      <td data-label="Category">{category.name}</td>
      <td data-label="Created">
        <LocalTime value={category.created_at} />
      </td>
      <td data-label="Actions">
        <div className={styles.rowActions}>
          <Button variant="secondary" aria-label={`Rename ${category.name}`} onClick={() => setRenameOpen(true)}>
            Rename
          </Button>
          <Button variant="danger" aria-label={`Delete ${category.name}`} onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>

        <Modal open={renameOpen} onClose={closeRename} title="Rename category">
          {renameOpen && (
            <CategoryForm
              id={`rename-category-${category.id}`}
              initialName={category.name}
              submitLabel="Save name"
              loading={rename.loading}
              error={rename.error}
              onSubmit={handleRename}
            />
          )}
        </Modal>

        <Modal open={deleteOpen} onClose={closeDelete} title="Delete this category?">
          <div className={styles.form}>
            <p>
              &ldquo;{category.name}&rdquo; will be deleted. Todos that use it keep working, but their category will
              be cleared. This cannot be undone.
            </p>
            {remove.error && <ErrorMessage message={getErrorMessage(remove.error)} />}
            <div className={styles.rowActions}>
              <Button variant="danger" loading={remove.loading} onClick={handleDelete}>
                Delete category
              </Button>
              <Button variant="secondary" disabled={remove.loading} onClick={closeDelete}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  );
}

export default function CategoriesTable({ categories }) {
  return (
    <table className={styles.table}>
      <caption className="visually-hidden">Categories</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Created</th>
          <th scope="col"><span className="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </tbody>
    </table>
  );
}