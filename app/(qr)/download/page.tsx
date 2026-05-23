import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Muat Turun - Tukar QR",
  },
  description:
    "Muat turun atau salin imej DuitNow QR yang telah dijana semula dengan jelas dan kemas.",
  alternates: {
    canonical: `${SITE_URL}/download`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return null;
}
