import { renderSvgToPng, type QrExportLayout } from "@/lib/qr-render";

export type ClipboardImageReadResult =
  | { ok: true; file: File }
  | { ok: false; reason: "unsupported" | "denied" | "no-image" };

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/avif": "avif",
};

function mimeToExtension(mime: string): string {
  return MIME_TO_EXT[mime] ?? mime.split("/")[1]?.split("+")[0] ?? "png";
}

function isPermissionDeniedError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "SecurityError")
  );
}

export async function readImageFromClipboard(): Promise<ClipboardImageReadResult> {
  if (
    typeof window === "undefined" ||
    !window.isSecureContext ||
    !navigator.clipboard?.read
  ) {
    return { ok: false, reason: "unsupported" };
  }

  try {
    const items = await navigator.clipboard.read();

    for (const item of items) {
      const imageType = item.types.find((type) => type.startsWith("image/"));
      if (!imageType) continue;

      const blob = await item.getType(imageType);
      const ext = mimeToExtension(imageType);
      const file = new File([blob], `clipboard-${Date.now()}.${ext}`, {
        type: imageType,
      });
      return { ok: true, file };
    }

    return { ok: false, reason: "no-image" };
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      return { ok: false, reason: "denied" };
    }
    return { ok: false, reason: "unsupported" };
  }
}

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
