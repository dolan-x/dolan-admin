export function toDisplayDate (date: string) {
  return new Date(date).toLocaleString().replace(/\//g, "-");
}
