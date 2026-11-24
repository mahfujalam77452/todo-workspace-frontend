import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LocalTime from '@/components/todos/LocalTime';
import styles from './Pm.module.css';

const STATUS = {
  sending: { tone: 'warning', label: 'Sending' },
  sent: { tone: 'success', label: 'Sent' },
  partially_failed: { tone: 'danger', label: 'Some failed' },
};

export default function BulkEmailHistory({ emails, error }) {
  return (
    <section className={styles.card} aria-labelledby="history-title">
      <h2 id="history-title" className={styles.cardTitle}>Sent messages</h2>

      {error && <ErrorMessage message={error} />}
      {!error && emails.length === 0 && (
        <EmptyState title="Nothing sent yet" description="Messages you send to your team appear here." />
      )}

      <ul className={styles.history}>
        {emails.map((email) => {
          const status = STATUS[email.status] ?? STATUS.sent;
          return (
            <li key={email.id} className={styles.historyItem}>
              <div className={styles.historyHead}>
                <strong>{email.subject}</strong>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
              <p className={styles.meta}>
                <LocalTime value={email.created_at} /> · {email.sent_count}/{email.recipient_count} delivered
                {email.failed_count > 0 && ` · ${email.failed_count} failed`}
              </p>
              <details>
                <summary>Show message</summary>
                <p className={styles.messageBody}>{email.message}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}