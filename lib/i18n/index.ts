export type { Locale, MessageParams, Messages } from "./types";
export {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALES,
} from "./types";
export { getMessage, interpolate } from "./get-message";
export { getCurrentLocale, setCurrentLocale, t } from "./locale-store";
export { LocaleProvider, useLocale, useT } from "./locale-provider";
export { localeInitScript } from "./locale-script";
