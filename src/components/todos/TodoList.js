import TodoCard from './TodoCard';
import styles from './Todos.module.css';

export default function TodoList({ todos, basePath }) {
  return (
    <ul className={styles.cardList}>
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} basePath={basePath} />
      ))}
    </ul>
  );
}