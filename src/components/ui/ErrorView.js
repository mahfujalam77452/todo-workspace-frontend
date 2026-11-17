'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import ButtonLink from './ButtonLink';
import styles from './ErrorView.module.css';

// Shared by app/error.js and app/(app)/error.js.
export default function ErrorView({ error, reset, homeHref = '/', homeLabel = 'Back to home', fullPage = false }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  // reset() alone only renders the page again. router.refresh() also loads the server data again.
  function handleRetry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className={`${styles.wrap} ${fullPage ? styles.fullPage : ''}`} role="alert">
      {/* TODO: add error illustration here */}
      <h1>Something went wrong</h1>
      <p className={styles.text}>
        An unexpected error happened while loading this page. You can try again, or go back.
      </p>
      {error?.digest && <p className={styles.reference}>Reference: {error.digest}</p>}
      <div className={styles.actions}>
        <Button loading={pending} onClick={handleRetry}>Try again</Button>
        <ButtonLink href={homeHref} variant="secondary">{homeLabel}</ButtonLink>
      </div>
    </div>
  );
}