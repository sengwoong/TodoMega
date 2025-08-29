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


// 검색 API: 제목 또는 사용자명(username) 포함 검색 + 선택적 필터
export async function searchTodos(params = {}) {
  const { todos } = await ensureSeeded();
  const query = String(params.q || '').trim().toLowerCase();
  const username = params.username ? String(params.username).trim() : '';
  const completedFlag = typeof params.completed === 'boolean' ? params.completed : null;

  let result = todos.slice();
  if (query) {
    result = result.filter((t) =>
      String(t.title || '').toLowerCase().includes(query) ||
      String(t.username || '').toLowerCase().includes(query)
    );
  }
  if (username) {
    result = result.filter((t) => String(t.username) === username);
  }
  if (completedFlag !== null) {
    result = result.filter((t) => Boolean(t.completed) === completedFlag);
  }
  return result;
}


