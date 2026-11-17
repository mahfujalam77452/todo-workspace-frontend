'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { clearCategoryCaches } from '@/lib/category-cache';
import CategoryForm from './CategoryForm';

export default function CreateCategoryModal() {
  const [open, setOpen] = useState(false);
  const { run, loading, error, reset } = useAction();

  function close() {
    setOpen(false);
    reset();
  }

  async function handleCreate(name) {
    const { ok } = await run(async () => {
      const category = await apiFetch('/categories', { method: 'POST', body: { name } });
      // Clear the cache before the page refreshes, so the new category shows up at once.
      await clearCategoryCaches();
      return category;
    });
    if (ok) setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New category</Button>
      <Modal open={open} onClose={close} title="New category">
        {/* The form is mounted only while the modal is open, so it is empty every time */}
        {open && (
          <CategoryForm
            id="new-category-name"
            submitLabel="Create category"
            loading={loading}
            error={error}
            onSubmit={handleCreate}
          />
        )}
      </Modal>
    </>
  );
}