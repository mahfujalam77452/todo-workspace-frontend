'use client';

import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import TodoForm from './TodoForm';
import styles from './Todos.module.css';

export default function TodoEditForm({ todo, categories }) {
  const { run, loading, error } = useAction();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(body) {
    setSaved(false);
    const { ok } = await run(() => apiFetch(`/todos/${todo.id}`, { method: 'PATCH', body }));
    if (ok) setSaved(true);
  }

  return (
    <>
      <TodoForm
        mode="edit"
        todo={todo}
        categories={categories}
        loading={loading}
        error={error}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
      {saved && !error && (
        <p role="status" className={styles.success}>Changes saved.</p>
      )}
    </>
  );
}