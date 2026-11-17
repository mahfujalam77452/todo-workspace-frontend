'use client';

import ErrorView from '@/components/ui/ErrorView';

export default function RootError({ error, reset }) {
  return <ErrorView error={error} reset={reset} fullPage />;
}