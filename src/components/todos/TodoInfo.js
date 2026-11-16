import { isOverdue } from '@/lib/format';
import PriorityBadge from './PriorityBadge';
import LocalTime from './LocalTime';
import styles from './Todos.module.css';

function Item({ label, children }) {
  return (
    <div className={styles.infoItem}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Person({ person }) {
  if (!person) return 'Nobody yet';
  return (
    <>
      {person.name}
      <br />
      <span className={styles.meta}>{person.email}</span>
    </>
  );
}

export default function TodoInfo({ todo }) {
  const overdue = isOverdue(todo);

  return (
    <dl className={styles.infoGrid}>
      <Item label="Assigned by"><Person person={todo.assigner} /></Item>
      <Item label="Assigned to"><Person person={todo.assignee} /></Item>
      <Item label="Team">{todo.team ? todo.team.name : 'No team'}</Item>
      <Item label="Category">{todo.category_name || 'No category'}</Item>
      <Item label="Priority"><PriorityBadge priority={todo.priority} /></Item>
      <Item label="Due date">
        <span className={overdue ? styles.overdue : undefined}>
          <LocalTime value={todo.due_date} empty="No due date" />
          {overdue && ' · Overdue'}
        </span>
      </Item>
      <Item label="Assigned at"><LocalTime value={todo.assigned_at} /></Item>
      <Item label="Responded at"><LocalTime value={todo.responded_at} /></Item>
      <Item label="Created"><LocalTime value={todo.created_at} /></Item>
    </dl>
  );
}