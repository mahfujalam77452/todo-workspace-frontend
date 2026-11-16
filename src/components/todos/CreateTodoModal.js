'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import TodoForm from './TodoForm';

export default function CreateTodoModal({ categories, members, currentUser }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // a new key gives an empty form next time
  const { run, loading, error, reset } = useAction();

  function close() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(body) {
    const { ok } = await run(() => apiFetch('/todos', { method: 'POST', body }));
    if (ok) {
      setOpen(false);
      setFormKey((key) => key + 1);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New todo</Button>
      <Modal open={open} onClose={close} title="New todo">
        <TodoForm
          key={formKey}
          mode="create"
          categories={categories}
          members={members}
          team={currentUser.team}
          currentUser={currentUser}
          loading={loading}
          error={error}
          submitLabel="Create todo"
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}