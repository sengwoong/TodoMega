import { useState } from 'react'
import './App.css'

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.title}</span>
      </label>
      <button className="delete" onClick={() => onDelete(todo.id)}>
        삭제
      </button>
    </li>
  )
}

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTodos(prev => [{ id: Date.now(), title, done: false }, ...prev])
    setText('')
  }

  function handleToggle(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function handleDelete(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const remaining = todos.filter(t => !t.done).length

  return (
    <div className="container">
      <h1>Todo One</h1>
      <form className="add" onSubmit={handleAdd}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
          aria-label="할 일"
        />
        <button type="submit">추가</button>
      </form>

      <div className="summary">남은 작업: {remaining} / {todos.length}</div>

      <ul className="list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
