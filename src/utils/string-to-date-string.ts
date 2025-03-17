export function stringToLocaleString(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString();
}
