'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/format';

export default function LocalTime({ value, empty = '—' }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (value) setText(formatDateTime(value));
  }, [value]);

  if (!value) return empty;
  return <time dateTime={value}>{text || '…'}</time>;
}