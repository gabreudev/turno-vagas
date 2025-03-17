export function getCookieExpirationDate(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000); // minutes * seconds * milliseconds
}
