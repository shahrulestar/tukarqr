import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Ketahui tentang Tukar QR — alat percuma untuk menukar gambar DuitNow QR yang kabur kepada QR digital yang jelas dan kemas.",
  alternates: {
    canonical: `${siteUrl}/tentang`,
  },
};

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[640px] w-full space-y-6 text-[15px] leading-[1.7] text-foreground">
        <h1 className="text-xl font-semibold">Tentang Tukar QR</h1>

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
