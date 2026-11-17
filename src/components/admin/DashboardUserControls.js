'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import useDebounce from '@/hooks/useDebounce';
import { USER_SORTS } from '@/lib/dashboard';
import styles from './Admin.module.css';

// Search and sort for the user activity table. Both live in the URL (userSearch, sort).
export default function DashboardUserControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('userSearch') ?? '';
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);

  function updateParams(changes) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [name, value] of Object.entries(changes)) {
      if (value) params.set(name, value);
      else params.delete(name);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch) updateParams({ userSearch: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className={styles.filters} role="search">
      <FormField label="Search users" htmlFor="dash-search">
        <Input
          id="dash-search"
          type="search"
          placeholder="Name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </FormField>

      <FormField label="Sort by" htmlFor="dash-sort">
        <Select
          id="dash-sort"
          value={searchParams.get('sort') ?? 'name'}
          onChange={(event) => updateParams({ sort: event.target.value === 'name' ? '' : event.target.value })}
        >
          {Object.entries(USER_SORTS).map(([key, sort]) => (
            <option key={key} value={key}>{sort.label}</option>
          ))}
        </Select>
      </FormField>
    </div>
  );
}