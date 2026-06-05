import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ThemeKeyboardShortcut } from "@/components/theme-keyboard-shortcut";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    default: "Tukar QR - DuitNow QR Regenerator",
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
    title: "Tukar QR - DuitNow QR Regenerator",
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
    title: "Tukar QR - DuitNow QR Regenerator",
    description:
      "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tukar QR",
  alternateName: "DuitNow QR Regenerator",
  url: SITE_URL,
  inLanguage: "ms",
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tukar QR",
  alternateName: "DuitNow QR Regenerator",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/favicon-32x32.png" as="image" />
      </head>
      <body
        className={`antialiased ${geistSans.className}`}
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
          <Toaster richColors position="top-center" visibleToasts={2} />
        </ThemeProvider>
      </body>
    </html>
  );
}
