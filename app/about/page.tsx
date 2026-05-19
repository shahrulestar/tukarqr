import type { Metadata } from "next";
import Image from "next/image";

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

        <h2 className="text-lg font-semibold pt-2">Bagaimana ia berfungsi</h2>

        <p>
          Proses ini ringkas dan pantas. Anda hanya perlu muat naik gambar QR
          atau gunakan kamera peranti anda untuk mengimbas DuitNow QR sedia ada.
          Sistem akan mendekod maklumat pembayaran daripada gambar tersebut dan
          menjana semula kod QR baharu yang jelas dalam format digital.
        </p>

        <ol className="list-decimal list-inside space-y-1">
          <li>Muat naik gambar DuitNow QR atau imbas menggunakan kamera.</li>
          <li>
            Sistem mendekod dan mengesahkan bahawa ia ialah DuitNow QR
            pembayaran Malaysia yang sah.
          </li>
          <li>
            QR digital yang jelas dijana semula dan sedia untuk dimuat turun
            atau disalin.
          </li>
        </ol>

        <h2 className="text-lg font-semibold pt-2">Keselamatan dan privasi</h2>

        <p>
          Semua pemprosesan dilakukan sepenuhnya dalam pelayar web anda. Tiada
          data, gambar, atau maklumat pembayaran dihantar ke mana-mana pelayan.
          Gambar yang dimuat naik tidak disimpan, tidak dilog, dan tidak dikongsi
          dengan mana-mana pihak ketiga. Sebaik sahaja anda menutup halaman,
          tiada data yang kekal.
        </p>

        <h2 className="text-lg font-semibold pt-2">Pengesahan DuitNow QR</h2>

        <p>
          Tukar QR hanya menyokong kod DuitNow QR pembayaran Malaysia yang sah.
          Sistem mengesahkan format EMVCo, kod negara Malaysia (MY), dan
          Application Identifier (AID) DuitNow sebelum menjana semula QR. Kod QR
          yang bukan DuitNow atau rosak akan ditolak secara automatik.
        </p>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="kenapa-heading"
        >
          <h2
            id="kenapa-heading"
            className="text-base font-semibold text-foreground"
          >
            Kenapa Tukar QR dicipta?
          </h2>
          <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-muted-foreground">
            <p>
              Ramai rakyat Malaysia menyimpan gambar DuitNow QR dalam galeri
              telefon untuk kegunaan kemudian — sama ada untuk pembayaran
              berulang, kongsi nombor akaun, atau rujukan pantas. Namun, gambar
              QR yang diambil melalui kamera atau tangkap skrin sering menjadi
              kabur, pecah, atau sukar diimbas semula.
            </p>
            <p>
              Tukar QR dicipta untuk menyelesaikan masalah ini. Ia membolehkan
              sesiapa sahaja menjana semula kod QR digital yang jelas dan kemas
              daripada gambar QR yang sudah ada — tanpa perlu minta QR baharu.
            </p>
            <h3 className="text-[14px] font-semibold text-foreground">
              Tukar QR sesuai untuk:
            </h3>
            <div className="space-y-3">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Pengguna peribadi
                </h3>
                <p>
                  Simpan dan jana semula DuitNow QR daripada galeri telefon
                  kepada QR berkualiti tinggi.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Pemilik perniagaan
                </h3>
                <p>
                  Tukar gambar QR kedai yang kabur kepada QR digital yang boleh
                  dicetak semula dengan jelas.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Penjual marketplace
                </h3>
                <p>
                  Sediakan QR pembayaran yang kemas untuk pelanggan di Shopee,
                  Lazada, atau media sosial.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Pereka dan pembangun
                </h3>
                <p>
                  Dapatkan QR dalam format digital untuk digunakan dalam reka
                  bentuk, aplikasi, atau bahan pemasaran.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Sesiapa sahaja
                </h3>
                <p>
                  Yang mempunyai gambar DuitNow QR dalam galeri dan mahu
                  menukarnya kepada QR yang jelas, kemas, dan sedia digunakan
                  semula.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="senarai-bank-heading"
        >
          <h2
            id="senarai-bank-heading"
            className="text-base font-semibold text-foreground"
          >
            Senarai bank dan institusi kewangan menyokong DuitNow QR
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            DuitNow QR disokong oleh pelbagai bank dan institusi kewangan di
            Malaysia. Lihat senarai penuh institusi yang menyokong DuitNow QR
            untuk memastikan bank anda termasuk dalam senarai.
          </p>
          <a
            href="/list"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Lihat senarai penuh
          </a>
        </section>

        <h2 className="text-lg font-semibold pt-2">Penafian</h2>

        <p>
          Tukar QR ialah alat bebas dan tidak bergabung, tidak disokong, dan
          tidak ditaja oleh Payments Network Malaysia Sdn Bhd (PayNet), DuitNow,
          atau mana-mana institusi kewangan. DuitNow dan logo DuitNow adalah
          tanda dagangan berdaftar milik PayNet.
        </p>

        <p>
          Alat ini hanya bertujuan untuk membantu pengguna menukar gambar QR
          yang kabur kepada QR digital yang jelas. Pengguna bertanggungjawab
          sepenuhnya untuk mengesahkan butiran penerima dan jumlah bayaran
          sebelum membuat sebarang transaksi. Tukar QR tidak bertanggungjawab
          atas sebarang kerugian atau transaksi yang salah.
        </p>

        <p>
          Jangan gunakan alat ini untuk penipuan, pemalsuan, atau sebarang
          aktiviti yang melanggar undang-undang.
        </p>
      </div>
    </main>
  );
}
