import Link from 'next/link';
import { isOverdue } from '@/lib/format';
import StatusBadge from './StatusBadge';
import AssignmentBadge from './AssignmentBadge';
import PriorityBadge from './PriorityBadge';
import LocalTime from './LocalTime';
import styles from './Todos.module.css';

export default function TodoCard({ todo }) {
  const overdue = isOverdue(todo);
  const assigneeName = todo.assignee ? todo.assignee.name : 'Unassigned';

  return (
    <li className={styles.card}>
      <Link href={`/todos/${todo.id}`} className={styles.cardLink}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{todo.title}</h3>
          <PriorityBadge priority={todo.priority} />
        </div>

        <div className={styles.badges}>
          <StatusBadge status={todo.status} />
          <AssignmentBadge status={todo.assignment_status} hasAssignee={Boolean(todo.assignee)} />
        </div>

        <p className={styles.people}>
          {todo.assigner.name} &rarr; {assigneeName}
        </p>
        <p className={styles.meta}>
          {todo.team ? todo.team.name : 'No team'} &middot; {todo.category_name || 'No category'}
        </p>

        {todo.due_date ? (
          <p className={overdue ? styles.overdue : styles.meta}>
            Due <LocalTime value={todo.due_date} />
            {overdue && ' · Overdue'}
          </p>
        ) : (
          <p className={styles.meta}>No due date</p>
        )}
      </Link>
    </li>
  );
}