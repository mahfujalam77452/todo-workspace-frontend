'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import useDebounce from '@/hooks/useDebounce';
import { ASSIGNMENT_STATUS_LABELS, PRIORITY_LABELS, TODO_STATUS_LABELS } from '@/lib/constants';
import styles from './Todos.module.css';

function FilterSelect({ id, label, value, onChange, children }) {
  return (
    <FormField label={label} htmlFor={id}>
      <Select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </Select>
    </FormField>
  );
}

// All filter values live in the URL. Changing a filter updates the URL and the server re-renders the list.
export default function TodoFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);

  function updateParams(changes) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [name, value] of Object.entries(changes)) {
      if (value) params.set(name, value);
      else params.delete(name);
    }
    params.delete('offset'); // go back to the first page when a filter changes
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  // Search waits until the user stops typing.
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch) updateParams({ search: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function clearFilters() {
    setSearch('');
    const relation = searchParams.get('relation');
    router.replace(relation ? `${pathname}?relation=${relation}` : pathname);
  }

  return (
    <div className={styles.filters} role="search">
      <FormField label="Search" htmlFor="filter-search">
        <Input
          id="filter-search"
          type="search"
          placeholder="Title, description, category"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </FormField>

      <FilterSelect
        id="filter-status"
        label="Status"
        value={searchParams.get('status') ?? ''}
        onChange={(value) => updateParams({ status: value })}
      >
        <option value="">Any status</option>
        {Object.entries(TODO_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="filter-assignment"
        label="Assignment"
        value={searchParams.get('assignment_status') ?? ''}
        onChange={(value) => updateParams({ assignment_status: value })}
      >
        <option value="">Any assignment</option>
        {Object.entries(ASSIGNMENT_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="filter-priority"
        label="Priority"
        value={searchParams.get('priority') ?? ''}
        onChange={(value) => updateParams({ priority: value })}
      >
        <option value="">Any priority</option>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="filter-category"
        label="Category"
        value={searchParams.get('category') ?? ''}
        onChange={(value) => updateParams({ category: value })}
      >
        <option value="">Any category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="filter-ordering"
        label="Sort by"
        value={searchParams.get('ordering') ?? ''}
        onChange={(value) => updateParams({ ordering: value })}
      >
        <option value="">Default</option>
        <option value="-created_at">Newest first</option>
        <option value="created_at">Oldest first</option>
        <option value="due_date">Due soonest</option>
        <option value="-priority">Highest priority</option>
        <option value="title">Title A to Z</option>
      </FilterSelect>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={searchParams.get('overdue') === 'true'}
          onChange={(event) => updateParams({ overdue: event.target.checked ? 'true' : '' })}
        />
        Overdue only
      </label>

      <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
    </div>
  );
}