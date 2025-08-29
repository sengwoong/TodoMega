import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'auth/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signIn(username, { remember, ttlMs: remember ? 7 * 24 * 60 * 60 * 1000 : undefined });
      const to = location.state?.from || '/';
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>로그인</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder="username (예: alice)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          기억하기
        </label>
        <button type="submit" disabled={loading}>로그인</button>
      </form>
    </div>
  );
}

export default Login;


