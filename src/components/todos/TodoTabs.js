import Link from 'next/link';
import { buildListHref } from '@/lib/todo-query';
import styles from './Todos.module.css';

const TABS = [
  { label: 'All', relation: '' },
  { label: 'Assigned to me', relation: 'assigned_to_me' },
  { label: 'Assigned by me', relation: 'assigned_by_me' },
];

export default function TodoTabs({ filters }) {
  const active = filters.relation || '';

  return (
    <nav className={styles.tabs} aria-label="Todo views">
      {TABS.map((tab) => {
        const isActive = tab.relation === active;
        return (
          <Link
            key={tab.label}
            href={buildListHref(filters, { relation: tab.relation })}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}