import Badge from '@/components/ui/Badge';
import { PRIORITY_LABELS } from '@/lib/constants';

const TONES = { 1: 'neutral', 2: 'info', 3: 'warning' };

export default function PriorityBadge({ priority }) {
  return <Badge tone={TONES[priority] || 'neutral'}>{PRIORITY_LABELS[priority] || 'Medium'} priority</Badge>;
}