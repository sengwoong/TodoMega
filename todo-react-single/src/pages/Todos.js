import React, { useMemo, useState } from 'react';
// Todos 페이지
// - React Query 훅으로 서버(임시 백엔드) 데이터에 접근합니다.
// - 추가/수정/삭제는 "뮤테이션" 훅을 통해 수행합니다.
// - 검색 입력은 디바운스로 과도한 호출을 막습니다.
// - 삭제 시 모달로 확인받아 실수를 줄입니다.
import { useUsersQuery } from 'server/userQueries';
import { useTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation, useTodosSearch } from 'server/todoQueries';
import useDebouncedValue from 'hook/useDebouncedValue';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { useAuth } from 'hook/AuthContext';

function Todos() {
  const { } = useAuth();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', username: '' });
  const [search, setSearch] = useState({ q: '', username: '', completed: 'all' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // 목록 쿼리: 전체 목록
  const { data: todosAll = [], isLoading: isTodosLoading } = useTodosQuery();
  const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();
  const debouncedQ = useDebouncedValue(search.q, 300);
  const searchParams = {
    q: debouncedQ,
    username: search.username || undefined,
    completed: search.completed === 'all' ? undefined : search.completed === 'true'
  };
  // 검색 쿼리: 검색어/필터가 있을 때 사용
  const { data: todosSearched = [], isLoading: isSearchLoading } = useTodosSearch(searchParams);

  // 뮤테이션 훅: 생성/수정/삭제. onError로 에러 메시지를 표시합니다.
  const createMutation = useCreateTodoMutation({ onError: (err) => setError(err.message) });
  const updateMutation = useUpdateTodoMutation({ onError: (err) => setError(err.message) });
  const deleteMutation = useDeleteTodoMutation({ onError: (err) => setError(err.message) });

  // 표시용: username → 이름 매핑을 만들어서 화면에 예쁘게 보여줌
  const usernameToName = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u.username, u.name || u.username));
    return map;
  }, [users]);

  // 추가 이벤트: 제출 시 뮤테이션 호출 → 성공 시 폼 리셋
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

  // 완료 토글: 현재 상태의 반대로 업데이트
  async function handleToggle(id, current) {
    try {
      await updateMutation.mutateAsync({ id, partial: { completed: !current } });
    } catch (err) {
      setError(err.message);
    }
  }

  // 삭제 버튼 클릭 시: 실제 삭제 전에 모달을 띄워 한번 더 확인
  async function handleDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  // 모달에서 "삭제"를 눌렀을 때 실제 삭제 수행
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

  const todos = (search.q || search.username || search.completed !== 'all') ? todosSearched : todosAll;
  if (isTodosLoading || isUsersLoading || isSearchLoading) return <div style={{ padding: 16 }}>로딩 중...</div>;
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
        <Button type="submit" disabled={submitting} variant="primary">추가</Button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="검색어 (제목/username)"
          value={search.q}
          onChange={(e) => setSearch((p) => ({ ...p, q: e.target.value }))}
        />
        <select
          value={search.username}
          onChange={(e) => setSearch((p) => ({ ...p, username: e.target.value }))}
        >
          <option value="">모든 사용자</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
        <select
          value={search.completed}
          onChange={(e) => setSearch((p) => ({ ...p, completed: e.target.value }))}
        >
          <option value="all">전체</option>
          <option value="true">완료</option>
          <option value="false">미완료</option>
        </select>
      </div>

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
                  <Button onClick={() => handleToggle(todo.id, todo.completed)} variant="ghost">
                    {todo.completed ? '미완료로' : '완료로'}
                  </Button>
                  <Button onClick={() => handleDelete(todo.id)} variant="danger">삭제</Button>
                </div>
              </li>
            );
          })}
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

export default Todos;

