import ButtonLink from '@/components/ui/ButtonLink';
import styles from './not-found.module.css';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className={styles.page}>
      {/* TODO: add 404 illustration here */}
      <p className={styles.code}>404</p>
      <h1>We could not find that page</h1>
      <p className={styles.text}>
        The link may be wrong, or the item may not exist. It may also belong to someone else.
      </p>
      <div className={styles.actions}>
        <ButtonLink href="/todos">Go to my todos</ButtonLink>
        <ButtonLink href="/" variant="secondary">Back to home</ButtonLink>
      </div>
    </main>
  );
}