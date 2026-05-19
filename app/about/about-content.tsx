"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AboutContent() {
  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "bagaimana",
        "keselamatan",
        "pengesahan",
        "kenapa",
        "senarai-bank",
        "penafian",
      ]}
      className="rounded-xl border border-border bg-muted/30 px-4 sm:px-5"
    >
      <AccordionItem value="bagaimana">
        <AccordionTrigger className="text-base font-semibold">
          Bagaimana ia berfungsi
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Proses ini ringkas dan pantas. Anda hanya perlu muat naik gambar QR
            atau gunakan kamera peranti anda untuk mengimbas DuitNow QR sedia
            ada. Sistem akan mendekod maklumat pembayaran daripada gambar
            tersebut dan menjana semula kod QR baharu yang jelas dalam format
            digital.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Muat naik gambar DuitNow QR atau imbas menggunakan kamera.
            </li>
            <li>
              Sistem mendekod dan mengesahkan bahawa ia ialah DuitNow QR
              pembayaran Malaysia yang sah.
            </li>
            <li>
              QR digital yang jelas dijana semula dan sedia untuk dimuat turun
              atau disalin.
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="keselamatan">
        <AccordionTrigger className="text-base font-semibold">
          Keselamatan dan privasi
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Semua pemprosesan dilakukan sepenuhnya dalam pelayar web anda. Tiada
            data, gambar, atau maklumat pembayaran dihantar ke mana-mana
            pelayan. Gambar yang dimuat naik tidak disimpan, tidak dilog, dan
            tidak dikongsi dengan mana-mana pihak ketiga. Sebaik sahaja anda
            menutup halaman, tiada data yang kekal.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pengesahan">
        <AccordionTrigger className="text-base font-semibold">
          Pengesahan DuitNow QR
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Tukar QR hanya menyokong kod DuitNow QR pembayaran Malaysia yang
            sah. Sistem mengesahkan format EMVCo, kod negara Malaysia (MY), dan
            Application Identifier (AID) DuitNow sebelum menjana semula QR. Kod
            QR yang bukan DuitNow atau rosak akan ditolak secara automatik.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="kenapa">
        <AccordionTrigger className="text-base font-semibold">
          Kenapa Tukar QR dicipta?
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Ramai rakyat Malaysia menyimpan gambar DuitNow QR dalam galeri
            telefon untuk kegunaan kemudian — sama ada untuk pembayaran
            berulang, kongsi nombor akaun, atau rujukan pantas. Namun, gambar QR
            yang diambil melalui kamera atau tangkap skrin sering menjadi kabur,
            pecah, atau sukar diimbas semula.
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
                Simpan dan jana semula DuitNow QR daripada galeri telefon kepada
                QR berkualiti tinggi.
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
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="senarai-bank">
        <AccordionTrigger className="text-base font-semibold">
          Senarai bank dan institusi kewangan menyokong DuitNow QR
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            DuitNow QR disokong oleh pelbagai bank dan institusi kewangan di
            Malaysia. Lihat senarai penuh institusi yang menyokong DuitNow QR
            untuk memastikan bank anda termasuk dalam senarai.
          </p>
          <a
            href="/list"
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-primary/90 hover:text-primary-foreground"
          >
            Lihat senarai penuh
          </a>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="penafian" className="border-b-0">
        <AccordionTrigger className="text-base font-semibold">
          Penafian
        </AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Tukar QR ialah alat bebas dan tidak bergabung, tidak disokong, dan
            tidak ditaja oleh Payments Network Malaysia Sdn Bhd (PayNet),
            DuitNow, atau mana-mana institusi kewangan. DuitNow dan logo
            DuitNow adalah tanda dagangan berdaftar milik PayNet.
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
