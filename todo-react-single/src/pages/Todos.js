import React, { useMemo, useState } from 'react';
import { useUsersQuery } from 'server/userQueries';
import { useTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from 'server/todoQueries';

function Todos() {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', username: '' });
  const [submitting, setSubmitting] = useState(false);
  const { data: todos = [], isLoading: isTodosLoading } = useTodosQuery();
  const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();

  const createMutation = useCreateTodoMutation({ onError: (err) => setError(err.message) });
  const updateMutation = useUpdateTodoMutation({ onError: (err) => setError(err.message) });
  const deleteMutation = useDeleteTodoMutation({ onError: (err) => setError(err.message) });

  const usernameToName = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u.username, u.name || u.username));
    return map;
  }, [users]);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await createMutation.mutateAsync({ ...form, completed: false });
      setForm({ title: '', username: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id, current) {
    try {
      await updateMutation.mutateAsync({ id, partial: { completed: !current } });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setError(err.message);
    }
  }

  if (isTodosLoading || isUsersLoading) return <div style={{ padding: 16 }}>로딩 중...</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>할 일 관리</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="할 일 제목"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
        <select
          value={form.username}
          onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          required
        >
          <option value="" disabled>
            작성자 선택
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>추가</button>
      </form>

      {todos.length === 0 ? (
        <div>할 일이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {todos.map((todo) => {
            const displayName = usernameToName.get(todo.username) || todo.username;
            return (
              <li key={todo.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{todo.title}</div>
                  <div style={{ fontSize: 14, color: '#555' }}>
                    작성자: {displayName} ({todo.username}) · 상태: {todo.completed ? '완료' : '미완료'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleToggle(todo.id, todo.completed)}>
                    {todo.completed ? '미완료로' : '완료로'}
                  </button>
                  <button onClick={() => handleDelete(todo.id)}>삭제</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Todos;

