'use client';

import ErrorView from '@/components/ui/ErrorView';

// Errors inside the app: the navbar and sidebar stay, only the content area shows the error.
export default function AppError({ error, reset }) {
  return <ErrorView error={error} reset={reset} homeHref="/todos" homeLabel="Go to my todos" />;
}