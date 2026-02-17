import { renderSvgToPng } from "@/lib/qr-render";

export interface CopyQrImageOptions {
  merchantName?: string | null;
  bankName?: string | null;
  includeText?: boolean;
  ratio?: "1:1" | "3:4";
  watermark?: boolean;
  outerBg?: "white" | "transparent";
}

/**
 * Copies QR image to clipboard using Safari-compatible approach.
 * Passes a Promise to ClipboardItem so the clipboard call stays synchronous
 * from the user gesture (required by Safari and Chrome mobile).
 */
export async function copyQrImageToClipboard(
  svgElement: SVGSVGElement,
  options: CopyQrImageOptions
): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error("Salin imej tidak disokong. Cuba muat turun imej.");
  }

  const blobPromise = renderSvgToPng(svgElement, {
    merchantName: options.merchantName ?? null,
    bankName: options.bankName ?? null,
    includeText: options.includeText ?? false,
    ratio: options.ratio ?? "1:1",
    watermark: options.watermark ?? false,
    outerBg: options.outerBg ?? "white",
  }).then((dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png";
    const bstr = atob(arr[1] ?? "");
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  });

  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blobPromise }),
  ]);
}
