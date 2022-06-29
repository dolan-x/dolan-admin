import { atom, defineStore } from "sodayo";

import { DOLAN_TOKEN } from "~/constants";

export const useLoginStore = defineStore(() => {
  // TODO: Is token expired?
  const token = atom(localStorage.getItem(DOLAN_TOKEN) ?? "");
  function setToken (value: string) {
    token.value = value;
    localStorage.setItem(DOLAN_TOKEN, value);
  }
  return {
    token,
    setToken,
  };
});
