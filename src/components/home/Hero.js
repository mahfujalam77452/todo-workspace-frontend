import Link from 'next/link';
import ButtonLink from '@/components/ui/ButtonLink';
import Badge from '@/components/ui/Badge';
import styles from './Home.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.topbar}>
        <Link href="/" className={styles.brand}>TODOs Workspace</Link>
        <ButtonLink href="/login" variant="ghost">Log in</ButtonLink>
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 className={`${styles.title} ${styles.enter}`}>Hand off work. Know where it stands.</h1>
          <p className={`${styles.subtitle} ${styles.enter} ${styles.delay1}`}>
            Assign a todo to a teammate, wait for them to accept or reject it, and get notified at every step.
          </p>
          <div className={`${styles.actions} ${styles.enter} ${styles.delay2}`}>
            <ButtonLink href="/register">Start Now</ButtonLink>
            <ButtonLink href="/login" variant="secondary">I already have an account</ButtonLink>
          </div>
        </div>

        {/* Decorative preview of the product. Hidden from screen readers. */}
        <div className={styles.visual} aria-hidden="true">
          {/* TODO: add hero illustration here (can replace or sit behind the preview cards) */}
          <span className={`${styles.shape} ${styles.shapeA}`} />
          <span className={`${styles.shape} ${styles.shapeB}`} />

          <div className={`${styles.todoCard} ${styles.cardIn}`}>
            <p className={styles.cardTitle}>Prepare the Q3 launch checklist</p>
            <p className={styles.cardMeta}>Sara &rarr; Rafi &middot; Engineering</p>
            <Badge tone="warning">Pending</Badge>
          </div>

          <div className={`${styles.toast} ${styles.toastIn}`}>
            <Badge tone="success">Accepted</Badge>
            <span>Rafi accepted your todo</span>
          </div>
        </div>
      </div>
    </section>
  );
}