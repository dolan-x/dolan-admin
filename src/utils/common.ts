export function isEmptyObject<O extends object>(o: O): boolean {
  return JSON.stringify(o) === "{";
}

export function prettyJSON(o: any) {
  return JSON.stringify(o, null, 2);
}
