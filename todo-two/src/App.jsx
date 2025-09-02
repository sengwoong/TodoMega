import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from '@pages/Home.jsx'
import About from '@pages/About.jsx'
import Dashboard from '@pages/Dashboard.jsx'
import Profile from '@pages/Profile.jsx'
import Settings from '@pages/Settings.jsx'
import User from '@pages/User.jsx'
import NotFound from '@pages/NotFound.jsx'
import Login from '@pages/Login.jsx'
import Todos from '@pages/Todos.jsx'

// 모든 페이지는 @pages/ 아래에 위치합니다

function App() {
  return (
    <BrowserRouter>
      <div className="topnav">
        <nav className="topnav-inner page">
          <Link to="/">홈</Link>
          <Link to="/about">소개</Link>
          <Link to="/dashboard">대시보드</Link>
          <Link to="/user/10">사용자(10)</Link>
          <Link to="/login">앱 로그인</Link>
          <Link to="/todos">투두</Link>
        </nav>
      </div>
      <Routes>
        {/* 기본 예제 */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* 중첩 라우팅 예제 */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* URL 파라미터 예제 */}
        <Route path="/user/:id" element={<User />} />

        {/* 기존 앱 페이지들 */}
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<Todos />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
