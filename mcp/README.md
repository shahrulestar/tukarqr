# TukarQR MCP

Remote MCP at **https://mcp.tukarqr.my/mcp** (Cloudflare Worker `tukarqr-mcp`). The website stays on Pages.

Use it when someone attaches a blurry, old, or snapped DuitNow QR and wants a new card in the TukarQR format. Prefer `get_convert_qr_image` for one photo and `get_convert_qr_images_bulk` for up to 10. Use encode only when the EMVCo payload is already known. Use decode when they want the payload string and not a new card.

Agent rules: [`SKILL.md`](./SKILL.md). Visual reference: [`assets/examples/comparison-after.png`](./assets/examples/comparison-after.png). Frame/modules use `#ec4899`. SVG text uses the system UI font stack. Do not add a DuitNow logo. Do not invent QR images.

Payloads and images are processed in memory only. HEIC is not supported.

## Tools

| Tool | When to use | Output |
|------|-------------|--------|
| `get_convert_qr_image` | One blurry, old, or snapped PNG/JPEG | New TukarQR card; PNG is an image block, SVG stays text |
| `get_convert_qr_images_bulk` | Up to 10 photos, one shared style | ZIP of PNG cards; a failed photo does not stop the batch |
| `get_decode_qr_image` | Read one photo, do not draw a card | `{ ok, payload? }` (PNG/JPEG, no HEIC) |
| `get_decode_qr_images_bulk` | Read up to 10 photos | Per-item decode results |
| `get_encode_qr` | Valid DuitNow payload is already known | Styled PNG image or SVG; non-DuitNow payloads are rejected |
| `get_encode_qr_bulk` | Up to 10 known payloads, one shared style | ZIP of styled PNGs |
| `get_validate_duitnow_qr` | Check a pasted payload | `{ valid, reasonCode?, reason? }` |
| `get_parse_duitnow_qr` | Merchant, bank, amount, country | Short summary |
| `get_duitnow_qr_details` | Full raw fields | Summary + TLV / payment fields |

Style options match tukarqr.my export settings. If the user does not specify a style, use the defaults immediately.

| Setting | Field | Values | Default |
|---------|-------|--------|---------|
| Export format | `layout` | `duitnow` \| `plain` | `duitnow` |
| QR style | `qrStyle` | `classic` \| `rounded` | `classic` |
| Show bank name | `showBankName` | boolean | `true` |
| Background | `outerBg` | `white` \| `transparent` | `white` |
| Image size | `ratio` | `1:1` \| `3:4` | `1:1` |
| File format | `format` | `png` \| `svg` | `png` |

Non-DuitNow payloads are rejected before an image is drawn.

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
