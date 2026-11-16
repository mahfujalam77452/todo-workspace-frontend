import ButtonLink from '@/components/ui/ButtonLink';
import styles from './Home.module.css';

export default function CtaSection() {
  return (
    <section className={styles.ctaWrap}>
      <div className={`${styles.cta} reveal`}>
        <h2>Ready to stop chasing updates?</h2>
        <p>Create an account and assign your first todo in a minute.</p>
        <ButtonLink href="/register" variant="secondary">Start Now</ButtonLink>
      </div>
    </section>
  );
}