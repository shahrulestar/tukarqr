import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://qrkita.com"
  ),
  title: "QRKita - QR DuitNow Lebih Jelas, Lebih Mudah Digunakan.",
  description:
    "Muat naik atau ambil gambar QR DuitNow yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
  keywords: [
    "tukar qr duitnow",
    "qr duitnow tidak jelas",
    "tukar gambar qr kepada qr digital",
    "jana qr duitnow",
    "imbas qr duitnow",
  ],
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "QRKita",
    title: "QRKita - QR DuitNow Lebih Jelas, Lebih Mudah Digunakan.",
    description:
      "Muat naik atau ambil gambar QR DuitNow yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "QRKita - QR DuitNow Lebih Jelas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRKita - QR DuitNow Lebih Jelas, Lebih Mudah Digunakan.",
    description:
      "Muat naik atau ambil gambar QR DuitNow yang tidak jelas dan jana semula QR digital yang lebih jelas, kemas, dan sedia digunakan.",
    images: ["/image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QRKita",
  description:
    "Ramai pengguna hanya mempunyai gambar QR DuitNow yang tidak jelas atau diambil menggunakan kamera. Dengan alat ini, anda boleh menukar gambar QR tersebut kepada QR digital yang kemas dan boleh digunakan semula untuk pembayaran.",
  applicationCategory: "UtilitiesApplication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
