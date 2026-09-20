import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  buildExportSvg,
  formatExportFilename,
  resolveExportOptions,
  type QrEncodeFormat,
  type QrExportLayout,
  type QrModuleStyle,
  type QrOuterBg,
} from "@tukarqr/qr-core";

export interface EncodeQrInput {
  payload: string;
  /** Output file format (png | svg). Default png. */
  format?: QrEncodeFormat;
  /** Export format: duitnow frame | plain QR only. */
  layout?: QrExportLayout;
  /** QR module style: classic (square) | rounded. */
  qrStyle?: QrModuleStyle;
  /** Canvas background. */
  outerBg?: QrOuterBg;
  /** Show bank name on framed export. */
  showBankName?: boolean;
  merchantName?: string;
  bankName?: string;
}

/** Compact Latin subset for Workers PNG (SVG uses system-ui; no full font shipped). */
async function loadRasterFont(): Promise<Uint8Array> {
  try {
    const path = fileURLToPath(
      new URL("../../assets/fonts/latin-semibold.ttf", import.meta.url)
    );
    return new Uint8Array(await readFile(path));
  } catch {
    const mod = await import("../../assets/fonts/latin-semibold.ttf");
    return new Uint8Array(mod.default as ArrayBuffer);
  }
}

async function svgToPng(svg: string): Promise<Uint8Array> {
  let Resvg: typeof import("@cf-wasm/resvg/node").Resvg;
  try {
    ({ Resvg } = await import("@cf-wasm/resvg/workerd"));
  } catch {
    ({ Resvg } = await import("@cf-wasm/resvg/node"));
  }
  const font = await loadRasterFont();
  const instance = await Resvg.async(svg, {
    font: {
      fontBuffers: [font],
      // SVG declares system-ui; Workers have no OS fonts — subset fills glyphs.
      defaultFontFamily: "Noto Sans",
    },
  });
  return instance.render().asPng();
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function encodeQr(input: EncodeQrInput) {
  const payload = input.payload;
  if (!payload) return { error: "payload is required" };

  const built = buildExportSvg(payload, {
    format: input.format,
    layout: input.layout,
    // MCP image size is fixed square (same default as website 1:1).
    ratio: "1:1",
    qrStyle: input.qrStyle,
    outerBg: input.outerBg,
    showBankName: input.showBankName,
    merchantName: input.merchantName,
    bankName: input.bankName,
  });
  const optionsUsed = resolveExportOptions({
    ...built.options,
    format: input.format ?? built.options.format,
  });
  const filenameHint = formatExportFilename(built.options.merchantName);

  if (optionsUsed.format === "svg") {
    return {
      format: "svg" as const,
      mimeType: "image/svg+xml",
      data: built.svg,
      optionsUsed,
      filenameHint: filenameHint.replace(/\.png$/, ".svg"),
    };
  }

  const png = await svgToPng(built.svg);
  return {
    format: "png" as const,
    mimeType: "image/png",
    data: bytesToBase64(png),
    optionsUsed,
    filenameHint,
  };
}
