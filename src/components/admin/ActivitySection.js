import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getErrorMessage } from '@/lib/errors';
import { getDashboardActivity, getDashboardUsers } from '@/lib/server-data';
import ActivityFeed from './ActivityFeed';

export default async function ActivitySection() {
  const [activity, users] = await Promise.all([getDashboardActivity(15), getDashboardUsers()]);
  if (activity.error) return <ErrorMessage message={getErrorMessage(activity.error)} />;

  if (activity.data.length === 0) {
    return <EmptyState title="No activity yet" description="Activity appears here when todos are created or assigned." />;
  }

  // The feed only has user ids, so names come from the user metrics.
  const names = {};
  for (const user of users.data ?? []) names[user.id] = user.name;

  return <ActivityFeed items={activity.data} names={names} />;
}