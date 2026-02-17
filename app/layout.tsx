import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    title: "Tukar QR - DuitNow QR Regenerator",
    description:
      "Muat naik atau ambil gambar DuitNow QR yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: [
      {
        url: "/social-image.png",
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
    images: ["/social-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tukar QR",
  alternateName: "DuitNow QR Regenerator",
  description:
    "Ramai pengguna hanya mempunyai gambar DuitNow QR yang tidak jelas atau diambil menggunakan kamera. Dengan alat ini, anda boleh menukar gambar QR tersebut kepada QR digital yang kemas dan boleh digunakan semula untuk pembayaran.",
  applicationCategory: "UtilitiesApplication",
  url: siteUrl,
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
    <html lang="ms" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/favicon-32x32.png" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <Toaster richColors position="top-center" visibleToasts={2} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
