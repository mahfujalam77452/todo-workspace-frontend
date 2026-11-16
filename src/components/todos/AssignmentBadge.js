import Badge from '@/components/ui/Badge';
import { ASSIGNMENT_STATUS_LABELS } from '@/lib/constants';

const TONES = { pending: 'warning', accepted: 'success', rejected: 'danger' };

// The answer of the assignee. Different words from StatusBadge on purpose.
export default function AssignmentBadge({ status, hasAssignee = true }) {
  if (!hasAssignee) return <Badge>Unassigned</Badge>;
  return <Badge tone={TONES[status] || 'neutral'}>{ASSIGNMENT_STATUS_LABELS[status] || status}</Badge>;
}