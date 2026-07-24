import { getMessage } from "./get-message";
import type { Locale, MessageParams } from "./types";
import { DEFAULT_LOCALE } from "./types";

let currentLocale: Locale = DEFAULT_LOCALE;

export function getCurrentLocale(): Locale {
  return currentLocale;
}

export function setCurrentLocale(locale: Locale): void {
  currentLocale = locale;
}

/** Translate using the current locale (safe for non-React modules). */
export function t(key: string, params?: MessageParams): string {
  return getMessage(currentLocale, key, params);
}
