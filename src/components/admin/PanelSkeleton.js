import Skeleton from '@/components/ui/Skeleton';

export default function PanelSkeleton({ height = '10rem', label = 'Loading' }) {
  return (
    <div role="status" aria-label={label}>
      <span className="visually-hidden">{label}…</span>
      <Skeleton height={height} />
    </div>
  );
}