import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  buildExportSvg,
  formatExportFilename,
  resolveExportOptions,
  type QrEncodeFormat,
  type QrExportLayout,
  type QrExportRatio,
  type QrModuleStyle,
  type QrOuterBg,
} from "@tukarqr/qr-core";

export interface EncodeQrInput {
  payload: string;
  format?: QrEncodeFormat;
  layout?: QrExportLayout;
  ratio?: QrExportRatio;
  qrStyle?: QrModuleStyle;
  outerBg?: QrOuterBg;
  showBankName?: boolean;
  merchantName?: string;
  bankName?: string;
}

async function loadFont(): Promise<ArrayBuffer> {
  try {
    const path = fileURLToPath(
      new URL("../../assets/fonts/NotoSans-SemiBold.ttf", import.meta.url)
    );
    const buf = await readFile(path);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    const mod = await import("../../assets/fonts/NotoSans-SemiBold.ttf");
    return mod.default as ArrayBuffer;
  }
}

async function svgToPng(svg: string): Promise<Uint8Array> {
  let Resvg: typeof import("@cf-wasm/resvg/node").Resvg;
  try {
    ({ Resvg } = await import("@cf-wasm/resvg/workerd"));
  } catch {
    ({ Resvg } = await import("@cf-wasm/resvg/node"));
  }
  const font = await loadFont();
  const instance = await Resvg.async(svg, {
    font: {
      fontBuffers: [new Uint8Array(font)],
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
    ratio: input.ratio,
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
