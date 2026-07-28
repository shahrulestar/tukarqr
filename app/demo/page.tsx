import type { Metadata } from "next";
import { AboutHeroImage } from "@/app/about/about-hero-image";

export const metadata: Metadata = {
  title: {
    absolute: "Demo - Tukar QR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <AboutHeroImage />
    </main>
  );
}
