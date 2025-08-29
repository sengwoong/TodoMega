import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from 'back/user';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'demo_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) {
      setToken(saved);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
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
    const res = await apiLogin(username, options);
    setUser(res.user);
    setToken(res.token);
    if (options.remember) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    }
  }, []);

  const signOut = useCallback(async () => {
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


