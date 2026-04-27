// hooks/useLangQuery.js
import { useTranslation } from "react-i18next";

export const useLangQuery = (queryHook, args = {}, options = {}) => {
  const { i18n } = useTranslation();

  return queryHook({ ...args, lang: i18n.language }, options);
};
