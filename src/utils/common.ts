export function isEmptyObject<O extends object> (o: O): boolean {
  return JSON.stringify(o) === "{";
}
