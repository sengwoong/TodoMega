import { useParams } from 'react-router-dom'

export default function User() {
  const { id } = useParams()
  return <h2>사용자 ID: {id}</h2>
}


