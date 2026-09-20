# TukarQR MCP

Remote MCP at **https://mcp.tukarqr.my/mcp** (Cloudflare Worker `tukarqr-mcp`). The website stays on Pages.

Agent rules: [`SKILL.md`](./SKILL.md). Visual reference: [`assets/examples/comparison-after.png`](./assets/examples/comparison-after.png). Frame/modules use `#ec4899`. SVG text uses the system UI font stack. Do not add a DuitNow logo. Do not invent QR images.

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

Style options match tukarqr.my export settings:

| Setting | Field | Values | Default |
|---------|-------|--------|---------|
| Export format | `layout` | `duitnow` \| `plain` | `duitnow` |
| QR style | `qrStyle` | `classic` \| `rounded` | `classic` |
| Show bank name | `showBankName` | boolean | `true` |
| Background | `outerBg` | `white` \| `transparent` | `white` |
| Image size | _(fixed)_ | square `1:1` only | `1:1` |
| File format | `format` | `png` \| `svg` | `png` |

If the user does not specify, ask first (except image size — always square).

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
