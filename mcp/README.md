# TukarQR MCP

Remote MCP at **https://mcp.tukarqr.my/mcp** (Cloudflare Worker `tukarqr-mcp`). The website stays on Pages.

Agent rules: [`SKILL.md`](./SKILL.md). Visual reference: [`assets/examples/comparison-after.png`](./assets/examples/comparison-after.png) (about-page after image). Do not add a DuitNow logo. Do not invent QR images.

Payloads and images are processed in memory only.

## Tools

| Tool | Input | Output |
|------|-------|--------|
| `get_validate_duitnow_qr` | `payload` | `{ valid, reasonCode?, reason? }` |
| `get_parse_duitnow_qr` | `payload` | merchant, bank, amount, country |
| `get_duitnow_qr_details` | `payload` | summary + raw TLV / payment fields |
| `get_decode_qr_image` | PNG/JPEG base64 | `{ ok, payload? }` (no HEIC) |
| `get_decode_qr_images_bulk` | up to 10 images | per-item decode results |
| `get_encode_qr` | payload + style options | styled PNG base64 or SVG |
| `get_encode_qr_bulk` | up to 10 payloads + shared style | ZIP of styled PNGs |

Style options (defaults match tukarqr.my): `layout` `duitnow` \| `plain`, `ratio` `1:1` \| `3:4`, `qrStyle` `classic` \| `rounded`, `outerBg` `white` \| `transparent`, `showBankName` boolean. If the user does not specify, ask first.

## Local development

```bash
npm install
npm run mcp:dev
```

Endpoint: `http://localhost:8788/mcp`

```bash
npx @modelcontextprotocol/inspector@latest
```

## Deploy (Workers, not Pages)

```bash
npm run mcp:deploy
```

## Cursor

```json
{
  "mcpServers": {
    "tukarqr": {
      "url": "https://mcp.tukarqr.my/mcp"
    }
  }
}
```
