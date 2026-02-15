# Tukar QR

Convert blurry DuitNow QR images to clean digital QR codes. Upload a photo or use your camera to capture a DuitNow QR, and regenerate a crisp, scannable QR code for payment.

**Live:** [tukarqr.my](https://tukarqr.my)

## Features

- **Upload or camera** – Upload a photo or capture a DuitNow QR with your device camera
- **DuitNow validation** – Validates that the QR is a genuine Malaysia DuitNow payment code
- **Malaysia National QR styling** – Generated QR includes branded border and "MALAYSIA NATIONAL QR" label
- **Export options** – Download or copy as PNG in 1:1 (1000×1000) or 3:4 (900×1200) ratio
- **Responsive UI** – Dialog on desktop, drawer on mobile for ratio selection

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [jsQR](https://github.com/cozmo/jsQR) & [@zxing/browser](https://github.com/zxing-js/browser) for QR decoding
- [qrcode.react](https://github.com/zpao/qrcode.react) for QR generation

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

## Deployment

Deploy on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Deploy

The app is optimized for Vercel and uses [Vercel Analytics](https://vercel.com/docs/concepts/analytics) for privacy-friendly traffic insights. Enable Web Analytics in your project's Vercel dashboard.

## Privacy

All QR processing happens in your browser. No QR data or images are sent to any server. The app is fully client-side for decoding and generation.

## License

MIT
