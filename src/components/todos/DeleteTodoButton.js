'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Modal from '@/components/ui/Modal';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';
import styles from './Todos.module.css';

// Only the assigner sees this. The backend also returns 403 for anyone else.
export default function DeleteTodoButton({ todo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { run, loading, error, reset } = useAction();

  function close() {
    setOpen(false);
    reset();
  }

  async function handleDelete() {
    // No refresh here: this page will not exist anymore, so we leave it.
    const { ok } = await run(() => apiFetch(`/todos/${todo.id}`, { method: 'DELETE' }), { refresh: false });
    if (ok) {
      router.replace('/todos');
      router.refresh();
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete todo</Button>
      <Modal open={open} onClose={close} title="Delete this todo?">
        <div className={styles.form}>
          <p>&ldquo;{todo.title}&rdquo; will be deleted. This cannot be undone.</p>
          {error && <ErrorMessage message={getErrorMessage(error)} />}
          <div className={styles.actions}>
            <Button variant="danger" loading={loading} onClick={handleDelete}>Delete</Button>
            <Button variant="secondary" disabled={loading} onClick={close}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}