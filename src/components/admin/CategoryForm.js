'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { getErrorMessage, getFieldErrors } from '@/lib/errors';
import { validateCategory } from '@/lib/validators';
import styles from './Admin.module.css';

// The parent sends the request. This form only validates the name and shows errors.
export default function CategoryForm({ id = 'category-name', initialName = '', submitLabel, loading, error, onSubmit }) {
  const [name, setName] = useState(initialName);
  const [validationError, setValidationError] = useState('');

  // A duplicate or invalid name can come back as a field error (400). Other errors (like 409) are shown above the form.
  const apiErrors = getFieldErrors(error);
  const fieldError = validationError || apiErrors.name;
  const formMessage = error && !apiErrors.name ? getErrorMessage(error) : '';

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validateCategory({ name });
    setValidationError(errors.name ?? '');
    if (errors.name) return;
    onSubmit(name.trim());
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formMessage && <ErrorMessage message={formMessage} />}

      <FormField
        label="Category name"
        htmlFor={id}
        error={fieldError}
        hint="1 to 50 characters. Names are not case-sensitive."
      >
        <Input
          id={id}
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldError}
        />
      </FormField>

      <Button type="submit" loading={loading}>{submitLabel}</Button>
    </form>
  );
}