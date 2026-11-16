'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { PRIORITY_LABELS, TODO_STATUS_LABELS } from '@/lib/constants';
import { getAssignErrorMessage, getErrorMessage, getFieldErrors } from '@/lib/errors';
import { toDateTimeLocal } from '@/lib/format';
import { validateTodo } from '@/lib/validators';
import AssignPicker from './AssignPicker';
import styles from './Todos.module.css';

// mode "create": has the assignee picker.
// mode "edit": has the status field. The assignee cannot be changed here (use the assign panel).
// The parent sends the request. This form only validates and builds the body.
export default function TodoForm({
  mode,
  todo,
  categories = [],
  members = [],
  team = null,
  currentUser,
  loading,
  error,
  submitLabel,
  onSubmit,
}) {
  const [values, setValues] = useState({
    title: todo?.title ?? '',
    description: todo?.description ?? '',
    status: todo?.status ?? 'pending',
    priority: String(todo?.priority ?? 2),
    dueDate: '',
    category: todo?.category ? String(todo.category) : '',
    assignee: '',
  });
  const [errors, setErrors] = useState({});

  // The date is converted in the browser, so the server and the browser never disagree about the time zone.
  useEffect(() => {
    setValues((current) => ({ ...current, dueDate: toDateTimeLocal(todo?.due_date) }));
  }, [todo?.due_date]);

  const apiErrors = getFieldErrors(error);
  const hasFieldErrors = Object.keys(apiErrors).length > 0;
  const formMessage =
    error && !hasFieldErrors
      ? mode === 'create'
        ? getAssignErrorMessage(error)
        : getErrorMessage(error)
      : '';

  // apiName is the field name used by the backend.
  const fieldError = (name, apiName = name) => errors[name] || apiErrors[apiName];

  function setValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleChange(event) {
    setValue(event.target.name, event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateTodo(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const body = {
      title: values.title.trim(),
      description: values.description,
      priority: Number(values.priority),
      due_date: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      category: values.category ? Number(values.category) : null,
    };
    if (mode === 'edit') body.status = values.status;
    if (mode === 'create' && values.assignee) body.assignee_id = Number(values.assignee);

    onSubmit(body);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formMessage && <ErrorMessage message={formMessage} />}

      <FormField label="Title" htmlFor="todo-title" error={fieldError('title')}>
        <Input
          id="todo-title"
          name="title"
          value={values.title}
          onChange={handleChange}
          error={fieldError('title')}
        />
      </FormField>

      <FormField label="Description" htmlFor="todo-description" error={fieldError('description')}>
        <Textarea
          id="todo-description"
          name="description"
          value={values.description}
          onChange={handleChange}
          error={fieldError('description')}
        />
      </FormField>

      <div className={styles.formRow}>
        <FormField label="Priority" htmlFor="todo-priority" error={fieldError('priority')}>
          <Select
            id="todo-priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            error={fieldError('priority')}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Category" htmlFor="todo-category" error={fieldError('category')}>
          <Select
            id="todo-category"
            name="category"
            value={values.category}
            onChange={handleChange}
            error={fieldError('category')}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Due date" htmlFor="todo-due" error={fieldError('dueDate', 'due_date')}>
        <Input
          id="todo-due"
          name="dueDate"
          type="datetime-local"
          value={values.dueDate}
          onChange={handleChange}
          error={fieldError('dueDate', 'due_date')}
        />
      </FormField>

      {mode === 'edit' && (
        <FormField label="Status" htmlFor="todo-status" error={fieldError('status')}>
          <Select
            id="todo-status"
            name="status"
            value={values.status}
            onChange={handleChange}
            error={fieldError('status')}
          >
            {Object.entries(TODO_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </FormField>
      )}

      {mode === 'create' &&
        (team ? (
          <FormField
            label="Assign to (optional)"
            htmlFor="todo-assignee"
            error={fieldError('assignee', 'assignee_id')}
          >
            <AssignPicker
              id="todo-assignee"
              value={values.assignee}
              onChange={(value) => setValue('assignee', value)}
              members={members}
              team={team}
              currentUser={currentUser}
              error={fieldError('assignee', 'assignee_id')}
            />
          </FormField>
        ) : (
          <AssignPicker team={team} currentUser={currentUser} />
        ))}

      <Button type="submit" loading={loading}>{submitLabel}</Button>
    </form>
  );
}