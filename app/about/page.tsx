import type { Metadata } from "next";
import { PageBackButton } from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { GithubStarsButton } from "@/components/github-stars-button";
import { AboutHeroImage } from "./about-hero-image";
import { AccordionAbout } from "./accordion-about";
import { SITE_URL } from "@/lib/site-config";

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
        url: "/about.png",
        width: 1200,
        height: 630,
        alt: "Tentang Tukar QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang - Tukar QR",
    images: ["/about.png"],
  },
};

export default function AboutPage() {
  return (
    <main className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6 text-[15px] leading-[1.7] text-foreground">
        <PageBackButton className="-ml-2" />
        <h1 className="text-xl font-semibold">Tentang Tukar QR</h1>

        <AboutHeroImage />

        <p>
          Tukar QR ialah alat percuma yang membantu pengguna menukar gambar
          DuitNow QR yang kabur, tidak jelas, atau diambil melalui kamera kepada
          kod QR digital yang bersih, kemas, dan boleh diimbas semula untuk
          pembayaran.
        </p>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="open-source-heading"
        >
          <h2
            id="open-source-heading"
            className="text-base font-semibold text-foreground"
          >
            Sumber terbuka dan telus
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Kod sumber Tukar QR tersedia di GitHub. Anda boleh menyemak
            implementasi, membantu meningkatkan projek, atau melaporkan isu.
            Lencana bintang mencerminkan sokongan komuniti terhadap repositori
            terbuka ini — bukti bahawa alat ini dibangunkan secara terbuka dan
            boleh dipercayai.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GithubStarsButton />
            <Button variant="secondary" asChild>
              <a
                href="https://shahrulestar.com/sponsor"
                target="_blank"
                rel="noopener noreferrer"
              >
                Become Sponsor
              </a>
            </Button>
          </div>
        </section>

        <AccordionAbout />
      </div>
    </main>
  );
}
