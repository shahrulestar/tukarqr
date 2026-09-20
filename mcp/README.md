# TukarQR MCP

Remote MCP server for DuitNow QR **validate**, **parse**, and **encode**. Hosted as a Cloudflare Worker at:

**https://mcp.tukarqr.my/mcp**

The main site (`tukarqr.my`) stays on Cloudflare Pages. This Worker is a separate project (`tukarqr-mcp`).

Text-only: send EMVCo payload strings. Do not send images. Payloads are not stored.

## Tools

| Tool | Input | Output |
|------|-------|--------|
| `get_validate_duitnow_qr` | `payload` | `{ valid, reasonCode?, reason? }` |
| `get_parse_duitnow_qr` | `payload` | merchant, bank, amount, country |
| `get_encode_qr` | `payload`, optional `format` (`png` \| `svg`), `size` | PNG base64 or SVG |

## Local development

From the repo root:

```bash
npm install
npm run mcp:dev
```

MCP endpoint: `http://localhost:8788/mcp`

```bash
npx @modelcontextprotocol/inspector@latest
```

Connect the inspector to `http://localhost:8788/mcp`.

## Deploy (Workers, not Pages)

```bash
npm run mcp:deploy
```

This runs `wrangler deploy` (never `wrangler pages deploy`). Custom domain `mcp.tukarqr.my` is set in `wrangler.jsonc`.

## Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "tukarqr": {
      "url": "https://mcp.tukarqr.my/mcp"
    }
  }
}
```

Restart Cursor after saving.

## Claude Desktop

Add the endpoint URL under Settings → Connectors → Add custom connector.

## stdio fallback (`mcp-remote`)

For clients that only support subprocess MCP (no `url` field):

```json
{
  "mcpServers": {
    "tukarqr": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.tukarqr.my/mcp"]
    }
  }
}
```
