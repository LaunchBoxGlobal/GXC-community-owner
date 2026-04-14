import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enAuth from "./locales/en/enAuth.json";
import enCompleteProfile from "./locales/en/enCompleteProfile.json";
import enDashboard from "./locales/en/enDashboard.json";
import enCommunities from "./locales/en/enCommunities.json";

// Spanish
import esAuth from "./locales/es/esAuth.json";
import esCompleteProfile from "./locales/es/esCompleteProfile.json";
import esDashboard from "./locales/es/esDashboard.json";
import esCommunities from "./locales/es/esCommunities.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        completeProfile: enCompleteProfile,
        dashboard: enDashboard,
        communities: enCommunities,
      },
      es: {
        auth: esAuth,
        completeProfile: esCompleteProfile,
        dashboard: esDashboard,
        communities: esCommunities,
      },
    },
    fallbackLng: "en",
    ns: ["auth", "completeProfile", "dashboard", "communities"],
    defaultNS: "auth",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
