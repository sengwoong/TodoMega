import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
/**
 * AuthContext (로그인 상태 관리)
 * - 이 파일은 "앱 전역에서 로그인 상태를 공유"하기 위한 컨텍스트입니다.
 * - 주된 역할
 *   1) 앱이 시작될 때(localStorage에서) 토큰을 읽고, 현재 사용자 정보를 동기화합니다.
 *   2) 로그인(signIn), 로그아웃(signOut) 함수를 제공합니다.
 *   3) 화면 어디서든 `useAuth()`로 인증 상태(user, isAuthenticated 등)에 접근할 수 있습니다.
 * - 처음 보는 분을 위한 팁
 *   - 컨텍스트(Context)는 리액트에서 상태를 멀리까지 전달할 때 사용하는 도구입니다.
 *   - 여기서는 로그인 상태를 최상단에서 들고 있다가, 하위 모든 컴포넌트에서 꺼내 쓰게 해줍니다.
 */
import { login as apiLogin, logout as apiLogout, getCurrentUser } from 'back/user';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'demo_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 앱이 처음 켜질 때 한 번만 실행됩니다.
    // localStorage에 저장해 둔 토큰이 있으면 꺼내서 상태에 올립니다.
    const saved = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) {
      setToken(saved);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // token이 바뀔 때마다 현재 사용자 정보를 동기화합니다.
    // (토큰이 없으면 로그인되지 않은 상태로 설정)
    let cancelled = false;
    async function syncUser() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        setLoading(true);
        const u = await getCurrentUser(token);
        if (!cancelled) setUser(u);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    syncUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const signIn = useCallback(async (username, options = {}) => {
    // 로그인: 임시 백엔드(`src/back/user.js`)의 login 함수를 사용합니다.
    // 성공하면 토큰과 사용자 정보를 상태에 올리고, remember=true면 localStorage에도 저장합니다.
    const res = await apiLogin(username, options);
    setUser(res.user);
    setToken(res.token);
    if (options.remember) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    }
  }, []);

  const signOut = useCallback(async () => {
    // 로그아웃: 임시 백엔드에 토큰을 폐기하라고 알리고, 상태와 localStorage를 초기화합니다.
    try {
      if (token) await apiLogout(token);
    } finally {
      setUser(null);
      setToken(null);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);


  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
  }), [user, token, loading, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}

export default AuthContext;


