export type Locale = "ms" | "en";

export const LOCALES: Locale[] = ["ms", "en"];

export const DEFAULT_LOCALE: Locale = "ms";

export const LOCALE_STORAGE_KEY = "tukarqr-locale";

export type MessageParams = Record<string, string | number>;

export type Messages = Record<string, string>;
