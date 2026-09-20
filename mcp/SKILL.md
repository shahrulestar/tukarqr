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

1. Outer canvas — white (or transparent if `outerBg: transparent`); square for `1:1`, taller for `3:4`.
2. Frame — thick rounded rectangle in TukarQR primary magenta/pink; no logos on the border.
3. Inner white area — padded region inside the frame.
4. QR modules — centered near the top; **same primary magenta/pink** as the frame (not black); `classic` or `rounded`; **no center logo**.
5. Merchant line — centered black sans-serif under the QR (example: `MASJID AN NUR KG PULAU PA`).
6. Bank line — centered black sans-serif under merchant if `showBankName` (example: `Bank Islam Malaysia Berhad`).
7. Bottom bar — solid primary-magenta strip; white uppercase text exactly **`MALAYSIA NATIONAL QR`**.

Do not copy phone chrome or buttons from `public/about.png`. Only the QR **card** matching `comparison-after.png`.

## Tools

- `get_validate_duitnow_qr` — payload string in, valid/reason out
- `get_parse_duitnow_qr` — short summary (merchant, bank, amount, country)
- `get_duitnow_qr_details` — raw EMVCo TLV + payment fields when the user asks for full details
- `get_decode_qr_image` / `get_decode_qr_images_bulk` — PNG/JPEG base64 only (max 10). No HEIC
- `get_encode_qr` — styled single PNG/SVG
- `get_encode_qr_bulk` — up to 10 payloads → ZIP of styled PNGs, one shared style

## Do

- Use only these MCP tools with a real EMVCo payload (paste or decode). Never invent a payload.
- Prefer validate → parse/details → encode.
- If style is unspecified, **ask** for: layout (`duitnow` frame vs `plain`), ratio `1:1`/`3:4`, module `classic`/`rounded`, background `white`/`transparent`, show bank yes/no.
- If they skip choosing, use defaults: frame, 1:1, classic, white, show bank.
- For bulk images: decode first, report failures, ask style **once**, then `get_encode_qr_bulk`.
- For “what’s in this QR / raw details”: call `get_duitnow_qr_details`. Do not invent tags.
- Return the tool PNG/SVG/ZIP only.

## Do not

- Do not generate random, decorative, or AI images of QR codes.
- Do not use, download, or overlay the **DuitNow logo**, PayNet marks, bank logos, or any trademark artwork on the export or inside the QR.
- Do not redesign the frame (no badges, stickers, gradients, collages).
- Do not call generic image-generation tools for this task.
- Do not log or persist payloads/images.

## Workflows

```text
Single payload → export
1. Obtain EMVCo payload. Never invent one.
2. Validate/parse as needed.
3. Ask for export style if missing (result should look like comparison-after.png).
4. Call get_encode_qr.
5. Return the tool output; do not redraw it.

User asks for details / raw fields
1. Get payload (paste or decode image).
2. Call get_duitnow_qr_details.
3. Present summary + raw TLV; do not invent tags.

Bulk images (max 10)
1. Accept up to 10 PNG/JPEG images.
2. get_decode_qr_images_bulk.
3. Report which failed.
4. Ask style once.
5. get_encode_qr_bulk with successful payloads → ZIP.
6. Optionally run details on items the user singles out.
```
