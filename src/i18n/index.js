import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enAuth from "./locales/en/enAuth.json";
import enCompleteProfile from "./locales/en/enCompleteProfile.json";
import enDashboard from "./locales/en/enDashboard.json";
import enCommunities from "./locales/en/enCommunities.json";
import enReports from "./locales/en/enReports.json";
import enTransactionHistory from "./locales/en/enTransactionHistory.json";
import enReportedProducts from "./locales/en/enReportedProducts.json";
import enNotifications from "./locales/en/enNotifications.json";
import enSettings from "./locales/en/enSettings.json";
import enCommon from "./locales/en/enCommon.json";
import enProfile from "./locales/en/enProfile.json";

// Spanish
import esAuth from "./locales/es/esAuth.json";
import esCompleteProfile from "./locales/es/esCompleteProfile.json";
import esDashboard from "./locales/es/esDashboard.json";
import esCommunities from "./locales/es/esCommunities.json";
import esReports from "./locales/es/esReports.json";
import esTransactionHistory from "./locales/es/esTransactionHistory.json";
import esReportedProducts from "./locales/es/esReportedProducts.json";
import esNotifications from "./locales/es/esNotifications.json";
import esSettings from "./locales/es/esSettings.json";
import esCommon from "./locales/es/esCommon.json";
import esProfile from "./locales/es/esProfile.json";

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
        reports: enReports,
        transactionHistory: enTransactionHistory,
        reportedProducts: enReportedProducts,
        notifications: enNotifications,
        settings: enSettings,
        common: enCommon,
        profile: enProfile,
      },
      es: {
        auth: esAuth,
        completeProfile: esCompleteProfile,
        dashboard: esDashboard,
        communities: esCommunities,
        reports: esReports,
        transactionHistory: esTransactionHistory,
        reportedProducts: esReportedProducts,
        notifications: esNotifications,
        settings: esSettings,
        common: esCommon,
        profile: esProfile,
      },
    },
    fallbackLng: "en",
    ns: [
      "auth",
      "completeProfile",
      "dashboard",
      "communities",
      "reports",
      "transactionHistory",
      "reportedProducts",
      "notifications",
      "settings",
      "common",
      "profile",
    ],
    defaultNS: "auth",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
