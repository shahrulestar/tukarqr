import type { Metadata } from "next";
import { GithubStarsButton } from "@/components/github-stars-button";
import { AboutContent } from "./about-content";
import { SITE_URL, ABOUT_OG_IMAGE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Tentang - Tukar QR",
  },
  description:
    "Ketahui tentang Tukar QR — alat percuma untuk menukar gambar DuitNow QR yang kabur kepada QR digital yang jelas dan kemas.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "Tentang - Tukar QR",
    images: [
      {
        url: ABOUT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tentang Tukar QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang - Tukar QR",
    images: [ABOUT_OG_IMAGE],
  },
};

export default function AboutPage() {
  return <AboutContent githubStars={<GithubStarsButton />} />;
}
