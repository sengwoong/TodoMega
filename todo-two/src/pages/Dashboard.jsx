import { Link, Outlet } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h2>대시보드</h2>
      <nav>
        <Link to="profile">프로필</Link> | <Link to="settings">설정</Link>
      </nav>
      <Outlet />
    </div>
  )
}


