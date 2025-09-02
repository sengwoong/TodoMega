import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('이메일과 비밀번호를 입력하세요')
      return
    }
    // 데모 용: 로그인 성공 처리 후 /todos로 이동
    navigate('/todos', { replace: true })
  }

  return (
    <div className="container">
      <h1>로그인</h1>
      <form className="add" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-label="이메일"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-label="비밀번호"
        />
        <button type="submit">로그인</button>
      </form>
      {errorMessage && (
        <div className="summary" role="alert">{errorMessage}</div>
      )}

      <div className="summary">
        데모 계정으로 바로 이동하려면 <Link to="/todos">할 일 목록</Link>
      </div>
    </div>
  )
}


