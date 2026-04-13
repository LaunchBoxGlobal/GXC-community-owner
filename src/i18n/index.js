import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enAuth from "./locales/en/enAuth.json";

// Spanish
import esAuth from "./locales/es/esAuth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
      },
      es: {
        auth: esAuth,
      },
    },
    fallbackLng: "en",
    ns: ["auth"],
    defaultNS: "auth",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
