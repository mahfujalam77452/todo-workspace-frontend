'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Layout.module.css';

export default function NavLinks({ onNavigate }) {
  const { isAdmin, isPM } = useAuth();
  const pathname = usePathname();

  const items = [
    { href: '/todos', label: 'Todos' },
    { href: '/notifications', label: 'Notifications' },
    ...(isPM ? [{ href: '/pm/team-mail', label: 'Team mail' }] : []),
    // Hiding the link is only for the UI. The backend still blocks non-admins.
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
              >
                {/* TODO: add nav icon here */}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}