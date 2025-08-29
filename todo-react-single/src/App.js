import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Todos from './pages/Todos';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: 16, borderBottom: '1px solid #ddd', marginBottom: 24 }}>
          <NavLink to="/" end style={{ marginRight: 16 }}>
            Todos
          </NavLink>
          <NavLink to="/users">
            Users
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
