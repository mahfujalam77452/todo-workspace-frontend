'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useAction } from '@/hooks/useAction';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage, getFieldErrors } from '@/lib/errors';
import { validateBulkEmail } from '@/lib/validators';
import styles from './Pm.module.css';

export default function BulkEmailForm({ recipients }) {
  const { run, loading, error, reset } = useAction();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [validation, setValidation] = useState({});
  const [success, setSuccess] = useState('');

  const apiErrors = getFieldErrors(error);
  const subjectError = validation.subject || apiErrors.subject;
  const messageError = validation.message || apiErrors.message;
  // Errors that do not belong to a field (409 no members, 429 too many mails ...).
  const formMessage = error && !apiErrors.subject && !apiErrors.message ? getErrorMessage(error) : '';

  const count = recipients.length;
  const people = count === 1 ? 'person' : 'people';

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess('');
    reset();

    const errors = validateBulkEmail({ subject, message });
    setValidation(errors);
    if (Object.keys(errors).length > 0) return;

    const { ok, result } = await run(() =>
      apiFetch('/pm/bulk-emails', {
        method: 'POST',
        body: { subject: subject.trim(), message: message.trim() },
      }),
    );
    if (ok) {
      setSubject('');
      setMessage('');
      setSuccess(`Your message is being sent to ${result.recipient_count} ${result.recipient_count === 1 ? 'person' : 'people'}.`);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="compose-title">
      <h2 id="compose-title" className={styles.cardTitle}>New message</h2>

      <p className={styles.recipients}>
        <strong>To:</strong>{' '}
        {count === 0 ? 'nobody (you are the only member of your team)' : recipients.map((member) => member.name).join(', ')}
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formMessage && <ErrorMessage message={formMessage} />}
        {success && <p role="status" className={styles.success}>{success}</p>}

        <FormField label="Subject" htmlFor="bulk-subject" error={subjectError}>
          <Input
            id="bulk-subject"
            name="subject"
            value={subject}
            maxLength={150}
            onChange={(event) => setSubject(event.target.value)}
            error={subjectError}
          />
        </FormField>

        <FormField
          label="Message"
          htmlFor="bulk-message"
          error={messageError}
          hint={`${message.length}/5000 characters`}
        >
          <Textarea
            id="bulk-message"
            name="message"
            rows={8}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            error={messageError}
          />
        </FormField>

        <Button type="submit" loading={loading} disabled={count === 0}>
          Send to {count} {people}
        </Button>
      </form>
    </section>
  );
}