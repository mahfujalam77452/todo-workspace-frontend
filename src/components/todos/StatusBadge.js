import Badge from '@/components/ui/Badge';
import { TODO_STATUS_LABELS } from '@/lib/constants';

const TONES = { pending: 'neutral', in_progress: 'info', completed: 'success' };

// Progress of the work itself.
export default function StatusBadge({ status }) {
  return <Badge tone={TONES[status] || 'neutral'}>{TODO_STATUS_LABELS[status] || status}</Badge>;
}