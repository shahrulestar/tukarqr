import type { Messages } from "../types";

export const ms: Messages = {
  // nav
  "nav.footer.ariaLabel": "Footer",
  "nav.footer.about": "Tentang",
  "nav.language.ariaLabel": "Pilih bahasa",
  "nav.language.ms": "B. Melayu",
  "nav.language.en": "English",
  "nav.back.ariaLabel": "Kembali",

  // hero
  "hero.brand": "Tukar QR",
  "hero.tagline": "Jadikan imej DuitNow QR kembali seperti asal",

  // upload
  "upload.title": "Muat naik DuitNow QR",
  "upload.description": "Tukar gambar kabur kepada QR digital yang jelas",
  "upload.tab.upload": "Muat Naik",
  "upload.tab.camera": "Kamera",
  "upload.dropzone.title": "Muat naik imej DuitNow QR di sini",
  "upload.dropzone.hint.desktop": "atau tekan {mod}+V untuk tampal",
  "upload.dropzone.hint.mobile": "atau pilih dari galeri",
  "upload.dropzone.pasteButton": "Tampal Imej",
  "upload.dropzone.aria.desktop":
    "Muat naik imej QR. Letak imej di sini atau tekan Ctrl+V untuk tampal.",
  "upload.dropzone.aria.mobile":
    "Muat naik imej QR dari galeri, atau ketik Tampal imej.",
  "upload.input.aria": "Muat Naik Imej QR",
  "upload.camera.title": "Buka kamera untuk ambil imej DuitNow QR",
  "upload.camera.hint": "Gambar akan digunakan untuk dekod QR",
  "upload.camera.input.aria": "Ambil Gambar QR",
  "upload.list.count": "{n}/10 imej",
  "upload.list.hide": "Sembunyikan",
  "upload.list.show": "Tunjuk",
  "upload.list.clearAll.aria": "Buang Semua",
  "upload.list.section.done": "Selesai ({n})",
  "upload.list.section.failed": "Gagal ({n})",
  "upload.item.status.idle": "Sedia",
  "upload.item.status.decoding": "Mendekod",
  "upload.item.status.processing": "Memproses",
  "upload.item.status.done": "Selesai",
  "upload.item.status.errorFallback": "Dekod gagal.",
  "upload.item.remove.aria": "Buang Fail",
  "upload.item.preview.aria": "Pratonton {fileName}",
  "upload.toast.dragImagesOnly":
    "Sila seret fail imej sahaja (JPG, PNG, HEIC, dll.).",
  "upload.toast.noClipboardImage": "Tiada imej dalam papan keratan",
  "upload.toast.clipboardDenied.title": "Kebenaran ditolak",
  "upload.toast.clipboardDenied.description":
    "Benarkan akses papan keratan, atau pilih imej dari galeri.",
  "upload.toast.pasteUnsupported.title": "Tampal imej tidak disokong",
  "upload.toast.pasteUnsupported.description":
    "Pelayar ini mungkin tidak menyokong tampal imej. Sila pilih dari galeri.",
  "upload.toast.unsupportedFormat":
    "Format fail tidak disokong. Sila gunakan JPG, PNG atau HEIC.",
  "upload.toast.batchLimit":
    "Had maksimum {n} fail. Sebahagian fail tidak ditambah.",
  "upload.toast.decodeSuccess": "{n} QR dikesan dan diproses.",

  // result
  "result.region.aria": "Keputusan QR",
  "result.title": "QR siap digunakan",
  "result.description": "Imbas dengan app bank untuk bayar",
  "result.config.aria": "Tetapkan Reka Bentuk QR",
  "result.config.ariaSingle": "Tetapan Eksport",
  "result.alert.dismiss.aria": "Sembunyikan Peringatan",
  "result.alert.title": "Pastikan sebelum imbasan:",
  "result.alert.item.verifyName": "Sahkan nama penerima betul",
  "result.alert.item.checkAmount": "Semak jumlah bayaran jika ada",
  "result.alert.item.untrustedSource":
    "Jangan imbas QR dari sumber yang tidak dipercayai",
  "result.preview.aria": "Pratonton QR",
  "result.qr.title": "DuitNow QR - Imbas untuk bayar",
  "result.qr.alt": "DuitNow QR - Imbas untuk bayar",
  "result.qr.altNamed": "DuitNow QR - {name}",
  "result.qr.altFallbackName": "Imbas untuk bayar",
  "result.hint.saveHold":
    "Simpan, kongsi, atau tekan & tahan QR di atas untuk simpan",
  "result.downloadAll": "Muat Turun ({n})",
  "result.item.preview.aria": "Pratonton QR - {name}",

  // export
  "export.settings.title": "Tetapan eksport",
  "export.settings.description":
    "Tetapkan reka bentuk dan resolusi imej QR",
  "export.settings.skipPrompt": "Jangan Tunjuk Lagi",
  "export.settings.next": "Seterusnya",
  "export.form.layout.label": "Format eksport",
  "export.form.layout.duitnow": "DuitNow",
  "export.form.layout.plain": "QR Sahaja",
  "export.form.layout.plainHint":
    "Tiada nama penerima atau bank pada imej. Latar putih, nisbah 1:1.",
  "export.form.style.label": "Reka bentuk QR",
  "export.form.style.classic": "Petak",
  "export.form.style.rounded": "Bulat",
  "export.form.showBankName": "Papar nama bank",
  "export.form.bg.label": "Latar belakang",
  "export.form.bg.white": "Putih",
  "export.form.bg.transparent": "Lutsinar",
  "export.form.ratio.label": "Resolusi imej",
  "export.form.ratio.1_1": "1:1",
  "export.form.ratio.3_4": "3:4",
  "export.action.download": "Muat Turun",
  "export.sheet.title": "Simpan QR",
  "export.sheet.description": "Simpan atau kongsi QR anda",
  "export.sheet.save": "Simpan",
  "export.sheet.share": "Kongsi",
  "export.toast.copyFail.title": "Gagal salin",
  "export.toast.copyFail.description":
    "Sila gunakan muat turun sebagai alternatif.",
  "export.toast.shareFail.title": "Gagal kongsi",
  "export.toast.shareFail.description":
    "Sila gunakan muat turun sebagai alternatif.",
  "export.toast.copied": "QR disalin ke papan keratan.",
  "export.toast.shared": "QR dikongsi.",
  "export.toast.downloaded": "QR dimuat turun.",
  "export.toast.zipDownloaded": "{n} QR dimuat turun sebagai ZIP.",
  "export.toast.renderFail": "Gagal menjana QR. Sila cuba lagi.",
  "export.toast.zipFail": "Gagal menjana ZIP. Sila cuba lagi.",
  "export.toast.nothingToDownload": "Tiada imej QR untuk dimuat turun.",
  "export.error.shareUnsupported":
    "Kongsi imej tidak disokong pada peranti ini.",
  "export.error.copyUnsupported":
    "Salin imej tidak disokong. Cuba muat turun imej.",
  "export.canvas.nationalQr": "MALAYSIA NATIONAL QR",
  "export.canvas.watermark": "tukarqr.my",
  "export.shareQr.title": "DuitNow QR",

  // onboarding
  "onboarding.howTo.title": "Cara guna",
  "onboarding.howTo.description":
    "Ikuti langkah mudah untuk menukar DuitNow QR anda",
  "onboarding.howTo.step1.title": "Muat naik atau ambil gambar",
  "onboarding.howTo.step1.description":
    "Muat naik foto DuitNow QR atau ambil gambar menggunakan kamera peranti anda.",
  "onboarding.howTo.step2.title": "Dekod dan sahkan",
  "onboarding.howTo.step2.description":
    "Sistem akan dekod dan sahkan bahawa ia ialah DuitNow QR pembayaran Malaysia.",
  "onboarding.howTo.step3.title": "Muat turun atau salin",
  "onboarding.howTo.step3.description":
    "Muat turun imej QR yang jelas atau salin ke papan keratan.",
  "onboarding.howTo.next": "Seterusnya",
  "onboarding.privacy.title": "Dasar privasi",
  "onboarding.privacy.description":
    "Maklumat tentang privasi dan pemprosesan data",
  "onboarding.privacy.point1":
    "Semua pemprosesan QR berlaku dalam pelayar anda. Tiada data atau imej dihantar ke pelayan.",
  "onboarding.privacy.point2":
    "Alat ini berjalan terus dalam pelayar anda untuk dekod dan penjanaan QR.",
  "onboarding.privacy.point3":
    "Tiada skrip analitik pihak ketiga diperlukan untuk fungsi utama aplikasi ini.",
  "onboarding.privacy.done": "Faham",

  // rating
  "rating.modal.title": "Bagaimana pengalaman anda?",
  "rating.modal.description":
    "Berikan penilaian supaya kami boleh terus memperbaiki Tukar QR.",
  "rating.stars.aria": "Berikan Penilaian Anda",
  "rating.stars.defaultAria": "Penilaian bintang",
  "rating.stars.starN.aria": "{n} bintang",
  "rating.feedback.label": "Apa yang boleh kami perbaiki?",
  "rating.feedback.placeholder": "Ceritakan masalah atau cadangan anda...",
  "rating.feedback.minLength":
    "Sila masukkan sekurang-kurangnya {n} aksara.",
  "rating.feedback.submit": "Hantar Maklum Balas",
  "rating.feedback.submitting": "Menghantar...",
  "rating.thanks": "Terima kasih atas maklum balas anda!",
  "rating.share": "Kongsi Dengan Rakan",
  "rating.toast.submitFail.title": "Gagal menghantar penilaian",
  "rating.toast.feedbackFail.title": "Gagal menghantar maklum balas",
  "rating.toast.webhookMissing":
    "Webhook penilaian belum dikonfigurasi. Semak NEXT_PUBLIC_DISCORD_RATING_WEBHOOK_URL.",
  "rating.toast.retry": "Sila cuba lagi sebentar.",

  // about
  "about.heading": "Tentang Tukar QR",
  "about.intro":
    "Tukar QR ialah alat percuma yang membantu pengguna menukar gambar DuitNow QR yang kabur, tidak jelas, atau diambil melalui kamera kepada kod QR digital yang bersih, kemas, dan boleh diimbas semula untuk pembayaran.",
  "about.openSource.heading": "Sumber terbuka dan telus",
  "about.openSource.body":
    "Kod sumber Tukar QR tersedia di GitHub. Anda boleh menyemak implementasi, membantu meningkatkan projek, atau melaporkan isu. Lencana bintang mencerminkan sokongan komuniti terhadap repositori terbuka ini — bukti bahawa alat ini dibangunkan secara terbuka dan boleh dipercayai.",
  "about.openSource.stars": "Bintang",
  "about.openSource.sponsor": "Jadi Sponsor",
  "about.hero.beforeAlt": "QR fizikal asal — kabur dan tidak jelas",
  "about.hero.afterAlt": "QR digital selepas ditukar — jelas dan kemas",

  // accordion
  "accordion.howItWorks.title": "Bagaimana ia berfungsi",
  "accordion.howItWorks.p1": "Proses ini ringkas dan pantas.",
  "accordion.howItWorks.p2":
    "Muat naik gambar QR atau gunakan kamera peranti anda untuk mengimbas DuitNow QR sedia ada. Sistem akan mendekod maklumat pembayaran daripada gambar tersebut dan menjana semula kod QR baharu yang jelas dalam format digital.",
  "accordion.howItWorks.step1":
    "Muat naik gambar DuitNow QR atau imbas menggunakan kamera.",
  "accordion.howItWorks.step2":
    "Sistem mendekod dan mengesahkan bahawa ia ialah DuitNow QR pembayaran Malaysia yang sah.",
  "accordion.howItWorks.step3":
    "QR digital yang jelas dijana semula dan sedia untuk dimuat turun atau disalin.",
  "accordion.security.title": "Keselamatan dan privasi",
  "accordion.security.body":
    "Semua pemprosesan dilakukan sepenuhnya dalam pelayar web anda. Tiada data, gambar, atau maklumat pembayaran dihantar ke mana-mana pelayan. Gambar yang dimuat naik tidak disimpan, tidak dilog, dan tidak dikongsi dengan mana-mana pihak ketiga. Sebaik sahaja anda menutup halaman, tiada data yang kekal.",
  "accordion.validation.title": "Pengesahan DuitNow QR",
  "accordion.validation.body":
    "Tukar QR hanya menyokong kod DuitNow QR pembayaran Malaysia yang sah. Sistem mengesahkan format EMVCo, kod negara Malaysia (MY), dan Application Identifier (AID) DuitNow sebelum menjana semula QR. Kod QR yang bukan DuitNow atau rosak akan ditolak secara automatik.",
  "accordion.why.title": "Kenapa Tukar QR dicipta?",
  "accordion.why.p1":
    "Ramai rakyat Malaysia menyimpan gambar DuitNow QR dalam galeri telefon untuk kegunaan kemudian — sama ada untuk pembayaran berulang, kongsi nombor akaun, atau rujukan pantas. Namun, gambar QR yang diambil melalui kamera atau tangkap skrin sering menjadi kabur, pecah, atau sukar diimbas semula.",
  "accordion.why.p2":
    "Tukar QR dicipta untuk menyelesaikan masalah ini. Ia membolehkan sesiapa sahaja menjana semula kod QR digital yang jelas dan kemas daripada gambar QR yang sudah ada — tanpa perlu minta QR baharu.",
  "accordion.why.suitableHeading": "Tukar QR sesuai untuk:",
  "accordion.why.audience.personal.title": "Pengguna peribadi",
  "accordion.why.audience.personal.text":
    "Simpan dan jana semula DuitNow QR daripada galeri telefon kepada QR berkualiti tinggi.",
  "accordion.why.audience.business.title": "Pemilik perniagaan",
  "accordion.why.audience.business.text":
    "Tukar gambar QR kedai yang kabur kepada QR digital yang boleh dicetak semula dengan jelas.",
  "accordion.why.audience.seller.title": "Penjual marketplace",
  "accordion.why.audience.seller.text":
    "Sediakan QR pembayaran yang kemas untuk pelanggan di platform media sosial.",
  "accordion.why.audience.designer.title": "Designer atau developer",
  "accordion.why.audience.designer.text":
    "Dapatkan QR dalam format digital untuk digunakan dalam reka bentuk, aplikasi, atau bahan pemasaran.",
  "accordion.why.audience.anyone.title": "Sesiapa sahaja",
  "accordion.why.audience.anyone.text":
    "Yang mempunyai gambar DuitNow QR dalam galeri dan mahu menukarnya kepada QR yang jelas, kemas, dan sedia digunakan semula.",
  "accordion.banks.title":
    "Senarai bank dan institusi kewangan yang menyokong DuitNow QR",
  "accordion.banks.body":
    "DuitNow QR disokong oleh pelbagai bank dan institusi kewangan di Malaysia. Lihat senarai penuh institusi yang menyokong DuitNow QR untuk memastikan bank anda termasuk dalam senarai.",
  "accordion.banks.cta": "Lihat Senarai Penuh",
  "accordion.disclaimer.title": "Penafian",
  "accordion.disclaimer.p1":
    "Tukar QR ialah alat bebas dan tidak bergabung, tidak disokong, dan tidak ditaja oleh Payments Network Malaysia Sdn Bhd (PayNet), DuitNow, atau mana-mana institusi kewangan. DuitNow dan logo DuitNow adalah tanda dagangan berdaftar milik PayNet.",
  "accordion.disclaimer.p2":
    "Alat ini hanya bertujuan untuk membantu pengguna menukar gambar QR yang kabur kepada QR digital yang jelas. Pengguna bertanggungjawab sepenuhnya untuk mengesahkan butiran penerima dan jumlah bayaran sebelum membuat sebarang transaksi. Tukar QR tidak bertanggungjawab atas sebarang kerugian atau transaksi yang salah.",
  "accordion.disclaimer.p3":
    "Jangan gunakan alat ini untuk penipuan, pemalsuan, atau sebarang aktiviti yang melanggar undang-undang.",
  "accordion.feedback.before":
    "Untuk sebarang maklum balas, cadangan, atau laporan, hantar e-mel ke",

  // list
  "list.title":
    "Senarai bank dan institusi kewangan yang menyokong DuitNow QR di Malaysia.",
  "list.table.no": "No",
  "list.table.name": "Nama",
  "list.showAll": "Tunjuk Semua ({n})",
  "list.showLess": "Tunjuk Kurang",
  "list.source.label": "Sumber:",
  "list.source.link": "Paynet",

  // errors
  "errors.decode.tooLargeSize":
    "Imej terlalu besar. Saiz fail maksimum ialah 30MB.",
  "errors.decode.tooLargeResolution":
    "Imej terlalu besar. Resolusi maksimum ialah 4096px setiap sisi.",
  "errors.decode.unsupportedFormat":
    "Format imej tidak disokong. Sila gunakan JPG, PNG atau HEIC.",
  "errors.decode.corruptFile":
    "Fail imej rosak atau tidak boleh dibaca. Sila cuba fail lain.",
  "errors.decode.noQr":
    "Tiada kod QR dikesan dalam imej ini. Pastikan imej mengandungi kod QR yang jelas.",
  "errors.decode.blurry":
    "Imej QR tidak jelas atau kabur. Sila ambil gambar yang lebih jelas.",
  "errors.duitnow.invalidFormat":
    "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran.",
  "errors.duitnow.notDuitNow":
    "Kod QR ini bukan DuitNow QR pembayaran. Hanya kod DuitNow QR Malaysia disokong.",
  "errors.duitnow.invalidOrCorrupt": "Kod DuitNow QR tidak sah atau rosak.",
  "errors.duitnow.invalidOrCorruptHint":
    "Kod DuitNow QR tidak sah atau rosak. Sila muat naik imej QR yang lebih jelas.",
  "errors.duitnow.invalidFormatHint":
    "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran. Sila muat naik imej QR yang lebih jelas.",

  // share
  "share.app.title": "TukarQR",
  "share.app.text":
    "Tukar DuitNow QR kabur kepada imej yang jelas — percuma dan terus dalam pelayar.",
  "share.app.linkCopied": "Pautan disalin ke papan keratan.",
  "share.app.copyFail": "Gagal menyalin pautan ke papan keratan.",

  // a11y
  "a11y.imagePreview.defaultAlt": "Pratonton imej",
  "a11y.imagePreview.closeHint":
    "Klik di luar atau tekan Escape untuk tutup",

  // notFound
  "notFound.code": "404",
  "notFound.message": "Halaman tidak dijumpai.",
  "notFound.cta": "Kembali Ke Tukar QR",
};
