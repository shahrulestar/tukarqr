export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

export const DEFAULT_OG_IMAGE = "/og-image.png";
export const ABOUT_OG_IMAGE = "/about.png";

export const SITE_ICONS = {
  favicon: "/favicon.ico",
  favicon16: "/favicon-16x16.png",
  favicon32: "/favicon-32x32.png",
  appleTouch: "/apple-touch-icon.png",
  android192: "/android-chrome-192x192.png",
  android512: "/android-chrome-512x512.png",
} as const;

export const DISCORD_RATING_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_DISCORD_RATING_WEBHOOK_URL ?? "";
