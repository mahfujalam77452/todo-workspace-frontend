'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FormField from '@/components/ui/FormField';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import useDebounce from '@/hooks/useDebounce';
import todoStyles from '@/components/todos/Todos.module.css';

export default function UserHistoryFilters({ scrums, categories, userTeamId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [values, setValues] = useState({
    scrum: searchParams.get('scrum') ?? '',
    category: searchParams.get('category') ?? '',
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
  });
  const debouncedValues = useDebounce(values, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [name, value] of Object.entries(debouncedValues)) {
      if (value) params.set(name, value);
      else params.delete(name);
    }
    const query = params.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    if (target !== `${pathname}${window.location.search}`) {
      router.replace(target, { scroll: false });
    }
    // searchParams is intentionally read only for preserving relation/show values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues]);

  return (
    <div className={`${todoStyles.filters} ${todoStyles.historyFilters}`} role="search" aria-label="Todo history filters">
      <FormField label="Scrum" htmlFor="history-scrum">
        <Select
          id="history-scrum"
          value={values.scrum}
          onChange={(event) => setValues((current) => ({ ...current, scrum: event.target.value }))}
        >
          <option value="">Current active Scrum</option>
          {scrums.filter((item) => item.team === userTeamId).map((item) => (
            <option key={item.id} value={item.id}>{item.name} ({item.status})</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Category" htmlFor="history-category">
        <Select
          id="history-category"
          value={values.category}
          onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
        >
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
      </FormField>
      <FormField label="From date" htmlFor="history-from">
        <Input
          id="history-from"
          type="date"
          value={values.from}
          onChange={(event) => setValues((current) => ({ ...current, from: event.target.value }))}
        />
      </FormField>
      <FormField label="To date" htmlFor="history-to">
        <Input
          id="history-to"
          type="date"
          min={values.from || undefined}
          value={values.to}
          onChange={(event) => setValues((current) => ({ ...current, to: event.target.value }))}
        />
      </FormField>
    </div>
  );
}
