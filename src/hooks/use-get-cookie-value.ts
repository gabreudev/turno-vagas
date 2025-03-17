import { useMounted } from './use-mounted';

export function useGetCookieValue(name: string): string | null {
  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }

  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1] || null
  );
}
