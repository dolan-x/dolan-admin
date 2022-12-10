export function toDisplayDate(date: string | number) {
  return new Date(date).toLocaleString().replace(/\//g, "-");
}
