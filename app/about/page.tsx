import type { Metadata } from "next";
import Image from "next/image";
import { AboutContent } from "./about-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

export const metadata: Metadata = {
  title: {
    absolute: "Tentang - Tukar QR",
  },
  description:
    "Ketahui tentang Tukar QR — alat percuma untuk menukar gambar DuitNow QR yang kabur kepada QR digital yang jelas dan kemas.",
  alternates: {
    canonical: `${siteUrl}/about`,
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
        <h1 className="text-xl font-semibold">Tentang Tukar QR</h1>

        <div className="flex justify-center">
          <Image
            src="/about.png"
            alt="Tukar QR - Tukar imej DuitNow QR seperti asal"
            width={640}
            height={336}
            className="w-full max-w-[640px] rounded-xl object-cover"
          />
        </div>

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
          <a
            href="https://github.com/shahrulestar/tukarqr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block"
          >
            <img
              alt="badge"
              src="https://shieldcn.dev/github/shahrulestar/tukarqr/stars.svg?size=default&font=geist&logo=github&logoColor=white&theme=dark"
              loading="lazy"
              decoding="async"
              className="block h-auto w-auto max-w-none dark:hidden"
            />
            <img
              alt="badge"
              src="https://shieldcn.dev/github/shahrulestar/tukarqr/stars.svg?size=default&font=geist&logo=github&logoColor=black&theme=light"
              loading="lazy"
              decoding="async"
              className="hidden h-auto w-auto max-w-none dark:block"
            />
            <span className="sr-only">
              Buka repositori GitHub shahrulestar/tukarqr
            </span>
          </a>
        </section>

        <p>
          Tukar QR ialah alat percuma yang membantu pengguna menukar gambar
          DuitNow QR yang kabur, tidak jelas, atau diambil melalui kamera kepada
          kod QR digital yang bersih, kemas, dan boleh diimbas semula untuk
          pembayaran.
        </p>

        <AboutContent />
      </div>
    </main>
  );
}
