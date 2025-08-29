import { useEffect, useState } from 'react';
// useDebouncedValue
// - 입력 값(value)이 바뀌어도, 지정한 시간(delayMs) 동안 변경을 모아서
//   마지막 변경만 반영합니다. (검색 입력 최적화에 유용)

export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), Math.max(0, delayMs));
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}

export default useDebouncedValue;


