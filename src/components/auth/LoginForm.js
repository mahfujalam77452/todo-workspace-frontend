'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { apiFetch } from '@/lib/api-client';
import { ApiError, getErrorMessage, getFieldErrors } from '@/lib/errors';
import { validateLogin } from '@/lib/validators';
import styles from './AuthForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: { email: values.email.trim(), password: values.password },
      });
      router.replace('/todos');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError('Invalid email or password.');
      } else {
        const fieldErrors = getFieldErrors(error);
        setErrors(fieldErrors);
        setFormError(Object.keys(fieldErrors).length > 0 ? '' : getErrorMessage(error));
      }
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1>Log in</h1>
      <p className={styles.subtitle}>Welcome back. Enter your details to continue.</p>

      {formError && <ErrorMessage message={formError} />}

      <FormField label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
      </FormField>

      <Button type="submit" loading={loading}>Log in</Button>

      <p className={styles.footer}>
        New here? <Link href="/register">Create an account</Link>
      </p>
    </form>
  );
}