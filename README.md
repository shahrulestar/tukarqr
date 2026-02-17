# Tukar QR

Convert blurry DuitNow QR images to clean digital QR codes. Upload a photo or use your camera to capture a DuitNow QR, and regenerate a crisp, scannable QR code for payment.

**Live:** [tukarqr.my](https://tukarqr.my)

## Features

- **Upload or camera** – Upload photos or capture a DuitNow QR with your device camera
- **Batch processing** – Process up to 10 images at once with concurrent decoding
- **DuitNow validation** – Validates that the QR is a genuine Malaysia DuitNow EMVCo payment code
- **Malaysia National QR styling** – Generated QR includes branded border and "MALAYSIA NATIONAL QR" label
- **QR style options** – Choose between classic (square) and rounded module styles
- **Bank name display** – Optionally show the issuing bank name on the generated QR
- **Export options** – Download or copy as PNG in 1:1 or 3:4 ratio, with white or transparent background
- **Batch download** – Download all decoded QR codes as a ZIP file
- **Image preview** – Preview uploaded images in a fullscreen lightbox
- **Clipboard paste** – Paste images directly from clipboard with Ctrl+V / ⌘V
- **Drag & drop** – Drag image files into the upload zone
- **HEIC/HEIF support** – Automatically converts HEIC/HEIF images from iOS devices
- **Responsive UI** – Dialog on desktop, drawer on mobile for configuration
- **Onboarding flow** – First-time users see a guided how-to and privacy policy modal
- **Fully client-side** – All processing happens in the browser; no data leaves the device

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [Framer Motion](https://motion.dev) for animations
- [jsQR](https://github.com/cozmo/jsQR) & [@zxing/browser](https://github.com/zxing-js/browser) for QR decoding
- [qrcode](https://github.com/soldair/node-qrcode) for QR generation
- [JSZip](https://stuk.github.io/jszip/) for batch ZIP downloads
- [heic2any](https://github.com/nicolo-ribaudo/heic2any) for HEIC/HEIF conversion
- [Sonner](https://sonner.emilkowal.dev) for toast notifications
- [Vaul](https://vaul.emilkowal.dev) for mobile drawers
- [Vitest](https://vitest.dev) for testing

## Getting Started

### Prerequisites

- Node.js 18 or later

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Start (production)

```bash
npm start
```

### Test

```bash
npm test
```

## Deployment

Deploy on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Deploy

The app is optimized for Vercel and uses [Vercel Analytics](https://vercel.com/docs/concepts/analytics) for privacy-friendly traffic insights. Enable Web Analytics in your project's Vercel dashboard.

## Privacy

All QR processing happens entirely in your browser. No images, QR data, or payment information are sent to any server. Uploaded images are not stored, logged, or shared with any third party. Once you close the page, no data remains.

## License

MIT
