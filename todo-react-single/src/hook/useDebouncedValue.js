import { useEffect, useState } from 'react';

export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), Math.max(0, delayMs));
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}

export default useDebouncedValue;


