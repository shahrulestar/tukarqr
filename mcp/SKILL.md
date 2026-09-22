---
name: tukarqr-mcp
description: >-
  Use TukarQR MCP tools to validate, parse, inspect raw DuitNow QR details,
  decode PNG/JPEG images, and export Malaysia National QR cards in the official
  TukarQR style (see comparison-after.png). Trigger when the user asks to
  generate/export/encode a DuitNow QR, inspect QR fields, or bulk-convert
  uploaded QR photos, or when using mcp.tukarqr.my tools.
---

# TukarQR MCP

Remote tools: `https://mcp.tukarqr.my/mcp`

Visual ground truth: `mcp/assets/examples/comparison-after.png` (same as `public/comparison-after.png` on https://tukarqr.my/about).

## What a correct `layout: duitnow` export looks like

1. Outer canvas — white `#ffffff` (or transparent if `outerBg: transparent`); square `1:1` by default, or portrait `3:4` when the user asks.
2. Frame — thick rounded rectangle filled `#ec4899`; no logos on the border.
3. Inner white area — padded region inside the frame (`#ffffff`).
4. QR modules — centered near the top; fill `#ec4899` (same as frame, not black); `classic` or `rounded`; **no center logo**.
5. Merchant line — centered `#000000` system-ui under the QR (example: `MASJID AN NUR KG PULAU PA`).
6. Bank line — centered `#000000` system-ui under merchant if `showBankName` (example: `Bank Islam Malaysia Berhad`).
7. Bottom bar — solid `#ec4899` strip; white `#ffffff` uppercase text exactly **`MALAYSIA NATIONAL QR`**.

Primary pink color code: **`#ec4899`**. Do not substitute other pinks/magentas. Text uses the system UI font stack (`system-ui, -apple-system, …`), not a custom webfont.

## Export settings (same as website)

Use website defaults when the user does not name a style. Apply a custom style or `3:4` only when they ask:

| Setting | Tool field | Values | Default |
|---------|------------|--------|---------|
| Export format | `layout` | `duitnow` (National QR frame) / `plain` (QR only) | `duitnow` |
| QR style | `qrStyle` | `classic` (square) / `rounded` | `classic` |
| Show bank name | `showBankName` | `true` / `false` | `true` |
| Background | `outerBg` | `white` / `transparent` | `white` |
| Image size | `ratio` | `1:1` / `3:4` | `1:1` |
| File format | `format` | `png` / `svg` (single encode or convert) | `png` |

Do not copy phone chrome or buttons from `public/about.png`. Only the QR **card** matching `comparison-after.png`.

## Tools

- `get_validate_duitnow_qr` — payload string in, valid/reason out
- `get_parse_duitnow_qr` — short summary (merchant, bank, amount, country)
- `get_duitnow_qr_details` — raw EMVCo TLV + payment fields when the user asks for full details
- `get_decode_qr_image` / `get_decode_qr_images_bulk` — PNG/JPEG base64 only (max 10). No HEIC
- `get_encode_qr` — styled single PNG/SVG from a payload. Rejects non-DuitNow payloads
- `get_encode_qr_bulk` — up to 10 payloads → ZIP of styled PNGs, one shared style
- `get_convert_qr_image` — one PNG/JPEG → validate → styled PNG/SVG
- `get_convert_qr_images_bulk` — up to 10 images → ZIP of styled PNGs

## Do

- Use only these MCP tools with a real EMVCo payload (paste or decode). Never invent a payload.
- Prefer `get_convert_qr_image` when the user attaches a photo and wants an export. Prefer `get_encode_qr` when they already have a payload string.
- If style is unspecified, export immediately with website defaults: `duitnow`, classic, show bank, white, `1:1`, PNG. Do not ask a style questionnaire first.
- If they name a style or `3:4`, pass those fields.
- For bulk photos: `get_convert_qr_images_bulk` once, with defaults unless they named a style. Report which items failed.
- For “what’s in this QR / raw details”: call `get_duitnow_qr_details`. Do not invent tags.
- Return the tool PNG/SVG/ZIP only. A single PNG also arrives as an image block.

## Do not

- Do not generate random, decorative, or AI images of QR codes.
- Do not use, download, or overlay the **DuitNow logo**, PayNet marks, bank logos, or any trademark artwork on the export or inside the QR.
- Do not redesign the frame (no badges, stickers, gradients, collages).
- Do not call generic image-generation tools for this task.
- Do not log or persist payloads/images.

## Workflows

```text
Photo → styled export
1. Accept a PNG or JPEG. HEIC: ask for JPEG first, then stop.
2. Call get_convert_qr_image (or get_convert_qr_images_bulk for up to 10).
3. Use website defaults unless the user named a style or 3:4.
4. Return the tool image. Do not redraw it.

Single payload → export
1. Obtain a real EMVCo payload. Never invent one.
2. Call get_encode_qr with defaults unless a style was named.
3. Return the tool output; do not redraw it.

User asks for details / raw fields
1. Get payload (paste or decode image).
2. Call get_duitnow_qr_details.
3. Present summary + raw TLV; do not invent tags.
```
