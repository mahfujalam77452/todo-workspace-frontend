'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage, getFieldErrors } from '@/lib/errors';
import { validateRegister } from '@/lib/validators';
import styles from './AuthForm.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
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

    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: { name: values.name.trim(), email: values.email.trim(), password: values.password },
      });
      // The route handler logs the user in. If that step failed, send them to the login page.
      router.replace(data.loggedIn ? '/todos' : '/login');
      router.refresh();
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      setErrors(fieldErrors);
      setFormError(Object.keys(fieldErrors).length > 0 ? '' : getErrorMessage(error));
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1>Create account</h1>
      <p className={styles.subtitle}>It takes less than a minute.</p>

      {formError && <ErrorMessage message={formError} />}

      <FormField label="Name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />
      </FormField>

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

      <FormField label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters.">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
      </FormField>

      <Button type="submit" loading={loading}>Create account</Button>

      <p className={styles.footer}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}