import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ThemeKeyboardShortcut } from "@/components/theme-keyboard-shortcut";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_ICONS } from "@/lib/site-config";
import "./globals.css";
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tukar QR — Jana semula DuitNow QR yang jelas",
    template: "%s | Tukar QR",
  },
  description:
    "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
  keywords: [
    "tukar qr duitnow",
    "qr duitnow tidak jelas",
    "tukar gambar qr kepada qr digital",
    "jana qr duitnow",
    "imbas qr duitnow",
    "duitnow qr regenerator",
    "malaysia qr payment",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Tukar QR",
    url: SITE_URL,
    title: "Tukar QR — Jana semula DuitNow QR yang jelas",
    description:
      "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tukar QR - DuitNow QR Lebih Jelas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tukar QR — Jana semula DuitNow QR yang jelas",
    description:
      "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: SITE_ICONS.favicon16, sizes: "16x16", type: "image/png" },
      { url: SITE_ICONS.favicon32, sizes: "32x32", type: "image/png" },
      { url: SITE_ICONS.android192, sizes: "192x192", type: "image/png" },
      { url: SITE_ICONS.android512, sizes: "512x512", type: "image/png" },
    ],
    shortcut: SITE_ICONS.favicon,
    apple: [
      { url: SITE_ICONS.appleTouch, sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tukar QR",
  alternateName: "Jana semula DuitNow QR yang jelas",
  url: SITE_URL,
  inLanguage: "ms",
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tukar QR",
  alternateName: "Jana semula DuitNow QR yang jelas",
  description:
    "Ramai pengguna hanya mempunyai gambar DuitNow QR yang tidak jelas atau diambil menggunakan kamera. Dengan alat ini, anda boleh menukar gambar QR tersebut kepada QR digital yang kemas dan boleh digunakan semula untuk pembayaran.",
  applicationCategory: "UtilitiesApplication",
  url: SITE_URL,
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MYR",
  },
  inLanguage: "ms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ms"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable, "font-sans")}
    >
      <head>
        <link rel="preload" href={SITE_ICONS.favicon} as="image" />
        <link rel="preload" href={SITE_ICONS.favicon32} as="image" />
        <link rel="preload" href={SITE_ICONS.appleTouch} as="image" />
      </head>
      <body
        className={`antialiased ${GeistSans.className}`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLdWebSite),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLdWebApp),
            }}
          />
          <ThemeKeyboardShortcut />
          {children}
          <Toaster position="top-center" visibleToasts={2} />
        </ThemeProvider>
      </body>
    </html>
  );
}
