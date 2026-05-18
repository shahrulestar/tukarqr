import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

export const metadata: Metadata = {
  title: {
    absolute: "Muat Turun - Tukar QR",
  },
  description:
    "Muat turun atau salin imej DuitNow QR yang telah dijana semula dengan jelas dan kemas.",
  alternates: {
    canonical: `${siteUrl}/download`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return null;
}
