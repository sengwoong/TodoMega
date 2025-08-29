// Todo API (in-memory). Seeds once from public/server/todo.json via fetch

const memory = {
  seeded: false,
  todos: []
};

async function ensureSeeded() {
  if (!memory.seeded) {
    let todos = [];
    try {
      const res = await fetch('/server/todo.json');
      if (res && res.ok) {
        try {
          todos = await res.json();
        } catch {}
      }
    } catch {}
    memory.todos = Array.isArray(todos) ? todos : [];
    memory.seeded = true;
  }
  return { todos: memory.todos };
}

export async function getTodos() {
  const { todos } = await ensureSeeded();
  return todos.slice();
}

export async function createTodo(newTodo) {
  const { todos } = await ensureSeeded();
  const nextId = todos.length > 0 ? Math.max(...todos.map((t) => Number(t.id) || 0)) + 1 : 1;
  const todo = {
    id: nextId,
    title: String(newTodo.title || '').trim(),
    completed: Boolean(newTodo.completed),
    username: String(newTodo.username || '').trim(),
  };
  if (!todo.title) throw new Error('title이 필요합니다.');
  if (!todo.username) throw new Error('username이 필요합니다.');
  memory.todos = [...todos, todo];
  return todo;
}

export async function updateTodo(id, partial) {
  const { todos } = await ensureSeeded();
  memory.todos = todos.map((t) => (String(t.id) === String(id) ? { ...t, ...partial } : t));
  return memory.todos.find((t) => String(t.id) === String(id));
}

export async function deleteTodo(id) {
  const { todos } = await ensureSeeded();
  memory.todos = todos.filter((t) => String(t.id) !== String(id));
  return { ok: true };
}


