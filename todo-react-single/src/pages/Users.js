import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser } from 'server/user';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getUsers();
        if (!isCancelled) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const created = await createUser(form);
      setUsers((prev) => [...prev, created]);
      setForm({ username: '', name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div style={{ padding: 16 }}>로딩 중...</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>사용자 관리</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="username"
          value={form.username}
          onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          required
        />
        <input
          placeholder="이름(선택)"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <button type="submit" disabled={submitting}>추가</button>
      </form>

      {users.length === 0 ? (
        <div>사용자가 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {users.map((u) => (
            <li key={u.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 14, color: '#555' }}>@{u.username}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(u.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Users;

