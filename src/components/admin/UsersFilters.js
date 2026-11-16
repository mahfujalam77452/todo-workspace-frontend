'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import useDebounce from '@/hooks/useDebounce';
import styles from './Admin.module.css';

export default function UsersFilters({ teams }) {
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
    params.delete('offset'); // back to the first page
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch) updateParams({ search: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function clearFilters() {
    setSearch('');
    router.replace(pathname);
  }

  return (
    <div className={styles.filters} role="search">
      <FormField label="Search" htmlFor="users-search">
        <Input
          id="users-search"
          type="search"
          placeholder="Name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </FormField>

      <FormField label="Role" htmlFor="users-role">
        <Select
          id="users-role"
          value={searchParams.get('role') ?? ''}
          onChange={(event) => updateParams({ role: event.target.value })}
        >
          <option value="">Any role</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </Select>
      </FormField>

      <FormField label="Team" htmlFor="users-team">
        <Select
          id="users-team"
          value={searchParams.get('membership__team') ?? ''}
          onChange={(event) => updateParams({ membership__team: event.target.value })}
        >
          <option value="">Any team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </Select>
      </FormField>

      <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
    </div>
  );
}