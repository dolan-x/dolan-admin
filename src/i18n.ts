import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { DOLAN_I18N } from "./constants";

const resources = Object.fromEntries(
  Object.entries(
    import.meta.globEager("../locales/*.yml"))
    .map(([key, value]) => [key.slice(11, -4), { translation: value.default }]),
);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem(DOLAN_I18N) ?? undefined,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
