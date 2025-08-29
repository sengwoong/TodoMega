import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import Todos from './pages/Todos';
import Users from './pages/Users';
import Login from './pages/Login';
import { AuthProvider, useAuth } from 'context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function Nav() {
  const { user, isAuthenticated, signOut } = useAuth();
  return (
    <nav style={{ padding: 16, borderBottom: '1px solid #ddd', marginBottom: 24 }}>
      <NavLink to="/" end style={{ marginRight: 16 }}>
        Todos
      </NavLink>
      <NavLink to="/users" style={{ marginRight: 16 }}>
        Users
      </NavLink>
      {isAuthenticated ? (
        <span style={{ float: 'right' }}>
          <span style={{ marginRight: 8 }}>{user?.name}(@{user?.username})</span>
          <button onClick={signOut}>로그아웃</button>
        </span>
      ) : (
        <NavLink to="/login" style={{ float: 'right' }}>로그인</NavLink>
      )}
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 16 }}>로딩 중...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Nav />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Todos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
