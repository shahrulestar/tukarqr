import { renderSvgToPng, type QrExportLayout } from "@/lib/qr-render";

export interface CopyQrImageOptions {
  layout?: QrExportLayout;
  merchantName?: string | null;
  bankName?: string | null;
  includeText?: boolean;
  ratio?: "1:1" | "3:4";
  watermark?: boolean;
  outerBg?: "white" | "transparent";
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png";
  const bstr = atob(arr[1] ?? "");
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Safari requires clipboard.write() to be called synchronously from user gesture;
 * passing a Promise to ClipboardItem preserves that. Chrome mobile may need the
 * blob resolved first. We try both: Safari path first, fallback to Chrome path.
 */
export async function copyQrImageToClipboard(
  svgElement: SVGSVGElement,
  options: CopyQrImageOptions
): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error("Salin imej tidak disokong. Cuba muat turun imej.");
  }

  const renderOptions = {
    layout: options.layout ?? "duitnow",
    merchantName: options.merchantName ?? null,
    bankName: options.bankName ?? null,
    includeText: options.includeText ?? false,
    ratio: options.ratio ?? "1:1",
    watermark: options.watermark ?? false,
    outerBg: options.outerBg ?? "white",
  };

  const isSafari =
    typeof navigator !== "undefined" &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome|CriOS|Chromium/.test(navigator.userAgent);

  if (isSafari) {
    const blobPromise = renderSvgToPng(svgElement, renderOptions).then(
      dataUrlToBlob
    );
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blobPromise }),
    ]);
  } else {
    const dataUrl = await renderSvgToPng(svgElement, renderOptions);
    const blob = dataUrlToBlob(dataUrl);
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
  }
}
