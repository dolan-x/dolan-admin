import { atom, defineStore } from "sodayo";

export const usePersistStore = defineStore(() => {
  const a = atom("");
  return { a };
});
