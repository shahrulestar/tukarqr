# Tukar QR

<p align="center">
  <a href="https://tukarqr.my">
    <img
      src="./public/og-image.png"
      alt="Tukar QR — DuitNow QR Regenerator"
      width="720"
    />
  </a>
</p>

Convert blurry DuitNow QR photos into clean, scannable codes—upload, camera, or paste. All processing stays in the browser.

**Live:** [tukarqr.my](https://tukarqr.my)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Features

- **Input** – Upload, camera, drag-and-drop, clipboard paste (Ctrl+V / ⌘V), HEIC/HEIF from iOS
- **Batch** – Up to 10 images, concurrent decode, ZIP download of all results
- **DuitNow** – Validates Malaysia EMVCo payment QR; optional bank name on the generated code
- **Look & export** – Malaysia National QR frame, square or rounded modules, PNG copy/download (1:1 or 3:4, white or transparent background)
- **UX** – Responsive dialog/drawer, lightbox preview, onboarding + privacy modal, cross-browser clipboard

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion. QR: jsQR, ZXing, `qrcode`; HEIC: heic2any; ZIP: JSZip.

## Privacy

Nothing is uploaded to a server—QR work runs in your tab only.

## MCP

Remote MCP that regenerates a blurry, old, or snapped DuitNow QR photo into a new Malaysia National QR card in the TukarQR format. Hosted as a Cloudflare Worker at [https://mcp.tukarqr.my/mcp](https://mcp.tukarqr.my/mcp). The website stays on Pages; this Worker is a separate project (`tukarqr-mcp`).

Attach a PNG or JPEG and ask to regenerate the card. The usual path is `get_convert_qr_image` (or the bulk tool for up to 10 photos). If a style is not named, the card uses the website defaults: National QR frame, classic modules, bank name shown, white background, square 1:1 PNG. Portrait `3:4` is available when asked. A single PNG is returned as an image. HEIC is not supported. Payloads and images stay in memory only. Agent skill: [mcp/SKILL.md](mcp/SKILL.md).

| Tool | When to use | Output |
|------|-------------|--------|
| `get_convert_qr_image` | One blurry, old, or snapped PNG/JPEG | New TukarQR card (PNG image or SVG) |
| `get_convert_qr_images_bulk` | Up to 10 photos, one shared style | ZIP of new PNG cards; failed photos are reported |
| `get_decode_qr_image` | Read the payload only, do not draw a card | `{ ok, payload? }` (PNG/JPEG, no HEIC) |
| `get_decode_qr_images_bulk` | Read up to 10 photos | Per-item decode results |
| `get_encode_qr` | Payload string is already known | Styled PNG image or SVG; non-DuitNow payloads are rejected |
| `get_encode_qr_bulk` | Up to 10 known payloads | ZIP of styled PNGs |
| `get_validate_duitnow_qr` | Check a pasted payload | `{ valid, reasonCode?, reason? }` |
| `get_parse_duitnow_qr` | Merchant, bank, amount, country | Short summary |
| `get_duitnow_qr_details` | Full raw fields | Summary + TLV / payment fields |

Cursor (`~/.cursor/mcp.json` or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "tukarqr": {
      "url": "https://mcp.tukarqr.my/mcp"
    }
  }
}
```

Claude Desktop: add the endpoint URL under Settings → Connectors → Add custom connector.

Local development and deploy notes: [mcp/README.md](mcp/README.md).

## License

[MIT](LICENSE)
