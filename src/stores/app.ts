import { atom, defineStore } from "sodayo";

import { DOLAN_I18N } from "~/constants";

export const useAppStore = defineStore(() => {
  const i18n = atom(localStorage.getItem(DOLAN_I18N) ?? "");
  function setI18n (value: string) {
    i18n.value = value;
    localStorage.setItem(DOLAN_I18N, value);
  }
  return {
    i18n,
    setI18n,
  };
});
