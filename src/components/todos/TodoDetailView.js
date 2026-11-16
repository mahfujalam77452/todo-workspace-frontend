'use client';

import AssignmentBadge from './AssignmentBadge';
import StatusBadge from './StatusBadge';
import TodoInfo from './TodoInfo';
import AcceptRejectBar from './AcceptRejectBar';
import TodoEditForm from './TodoEditForm';
import AssignPanel from './AssignPanel';
import DeleteTodoButton from './DeleteTodoButton';
import styles from './Todos.module.css';

// Who can do what (the backend enforces the same rules):
//   assignee -> edit, accept, reject
//   assigner -> view, assign / re-assign, delete
//   readOnly -> no actions at all (used by the admin pages)
export default function TodoDetailView({ todo, currentUser, categories = [], members = [], readOnly = false }) {
  const isAssigner = todo.assigner?.id === currentUser.id;
  const isAssignee = todo.assignee?.id === currentUser.id;
  const canAssign = isAssigner && (!todo.assignee || todo.assignment_status !== 'accepted');

  let roleNote = '';
  if (!readOnly) {
    if (isAssigner && isAssignee) roleNote = 'You created this todo and it is assigned to you.';
    else if (isAssignee) roleNote = 'This todo is assigned to you.';
    else if (isAssigner && !todo.assignee) {
      roleNote = 'Nobody is assigned yet. Assign it to a teammate, or to yourself, so that it can be edited.';
    } else if (isAssigner) {
      roleNote = 'You assigned this todo. You can view it, but only the assignee can edit it.';
    }
  }

  return (
    <article className={styles.detail}>
      <header className={styles.detailHeader}>
        <h1 className={styles.detailTitle}>{todo.title}</h1>
        <div className={styles.badges}>
          <StatusBadge status={todo.status} />
          <AssignmentBadge status={todo.assignment_status} hasAssignee={Boolean(todo.assignee)} />
        </div>
        {roleNote && <p className={styles.notice}>{roleNote}</p>}
      </header>

      {todo.description && <p className={styles.description}>{todo.description}</p>}

      <TodoInfo todo={todo} />

      {!readOnly && isAssignee && <AcceptRejectBar todo={todo} />}

      {!readOnly && isAssignee && (
        <section className={styles.panel} aria-labelledby="edit-title">
          <h2 id="edit-title">Edit todo</h2>
          <TodoEditForm todo={todo} categories={categories} />
        </section>
      )}

      {!readOnly && canAssign && (
        <AssignPanel todo={todo} members={members} team={currentUser.team} currentUser={currentUser} />
      )}

      {!readOnly && isAssigner && (
        <div className={styles.actions}>
          <DeleteTodoButton todo={todo} />
        </div>
      )}
    </article>
  );
}