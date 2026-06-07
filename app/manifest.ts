import type { MetadataRoute } from "next";

import { SITE_ICONS } from "@/lib/site-config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tukar QR",
    short_name: "Tukar QR",
    description:
      "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "ms",
    scope: "/",
    icons: [
      {
        src: SITE_ICONS.favicon16,
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_ICONS.favicon32,
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_ICONS.android192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_ICONS.android512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
