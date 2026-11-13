import Link from 'next/link';
import styles from './Pagination.module.css';

// Server-friendly: page state is the `offset` search param.
// `params` = the other search params to keep (filters, search, ordering).
export default function Pagination({ total, limit, offset, basePath, params = {} }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;

  const page = Math.floor(offset / limit) + 1;

  function hrefFor(targetPage) {
    const query = new URLSearchParams(params);
    query.set('limit', String(limit));
    query.set('offset', String((targetPage - 1) * limit));
    return `${basePath}?${query.toString()}`;
  }

  return (
    <nav className={styles.nav} aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={styles.link}>Previous</Link>
      ) : (
        <span className={`${styles.link} ${styles.disabled}`} aria-disabled="true">Previous</span>
      )}

      <span className={styles.status}>Page {page} of {pages}</span>

      {page < pages ? (
        <Link href={hrefFor(page + 1)} className={styles.link}>Next</Link>
      ) : (
        <span className={`${styles.link} ${styles.disabled}`} aria-disabled="true">Next</span>
      )}
    </nav>
  );
}