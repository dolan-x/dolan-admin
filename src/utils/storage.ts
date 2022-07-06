export const serializedLocalStorage = {
  getItem<T = any> (key: string): T | null {
    const maybeItem = localStorage.getItem(key);
    if (maybeItem != null) { return JSON.parse(maybeItem); }

    return null;
  },
  setItem<T> (key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
