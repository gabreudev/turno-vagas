export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}

