import { useEffect, useState } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(function setMountedToTrue() {
    setMounted(true);
  }, []);

  return mounted;
}
