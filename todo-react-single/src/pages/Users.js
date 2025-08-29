import React, { useState } from 'react';
import { useUsersQuery, useCreateUserMutation, useDeleteUserMutation } from 'server/userQueries';
import Button from 'components/Button';
import Modal from 'components/Modal';

function Users() {
  const [error, setError] = useState(null);
  const { data: users = [], isLoading } = useUsersQuery();
  const [form, setForm] = useState({ username: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const createMutation = useCreateUserMutation({ onError: (err) => setError(err.message) });

  const deleteMutation = useDeleteUserMutation({ onError: (err) => setError(err.message) });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await createMutation.mutateAsync(form);
      setForm({ username: '', name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDeleteNow() {
    try {
      if (pendingDeleteId != null) {
        await deleteMutation.mutateAsync(pendingDeleteId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  }

  if (isLoading) return <div style={{ padding: 16 }}>로딩 중...</div>;
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
        <Button type="submit" disabled={submitting} variant="primary">추가</Button>
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
                <Button onClick={() => handleDelete(u.id)} variant="danger">삭제</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Modal.Content>
          <Modal.Title>확인</Modal.Title>
          <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
          <Modal.Actions>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button variant="danger" onClick={confirmDeleteNow}>삭제</Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default Users;

