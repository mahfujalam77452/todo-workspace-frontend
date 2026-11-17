'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Admin.module.css';

const LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/teams', label: 'Teams' },
  { href: '/admin/categories', label: 'Categories' },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.subNav} aria-label="Admin sections">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.subLink} ${active ? styles.subLinkActive : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}