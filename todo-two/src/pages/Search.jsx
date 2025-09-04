import { useSearchParams } from 'react-router-dom'

function Search() {
  const [params] = useSearchParams()
  const q = params.get('q')
  return <h2>검색 결과: {q}</h2>
}

export default Search


