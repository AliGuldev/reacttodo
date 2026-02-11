export default function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  return (
    <li style={{ color: '#000' }}>
      <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        <strong>{todo.title}</strong> - {todo.description}
      </div>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onToggle(todo.id, todo.completed)}>
        {todo.completed ? 'Undo' : 'Complete'}
      </button>
    </li>
  );
}