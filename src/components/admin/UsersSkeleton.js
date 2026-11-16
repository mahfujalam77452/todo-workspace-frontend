import Skeleton from '@/components/ui/Skeleton';

export default function UsersSkeleton() {
  return (
    <div role="status" aria-label="Loading users" style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <span className="visually-hidden">Loading users…</span>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} height="3.5rem" />
      ))}
    </div>
  );
}