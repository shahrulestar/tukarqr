import type { Locale, MessageParams, Messages } from "./types";
import { DEFAULT_LOCALE } from "./types";
import { en } from "./messages/en";
import { ms } from "./messages/ms";

const catalogs: Record<Locale, Messages> = { ms, en };

export function interpolate(
  template: string,
  params?: MessageParams
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function getMessage(
  locale: Locale,
  key: string,
  params?: MessageParams
): string {
  const catalog = catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
  const fallback = catalogs[DEFAULT_LOCALE];
  const template = catalog[key] ?? fallback[key] ?? key;
  return interpolate(template, params);
}
