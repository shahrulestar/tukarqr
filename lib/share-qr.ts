import { toast } from "sonner";

import type { QrRenderOptions } from "@/lib/qr-render";
import { renderSvgToPng } from "@/lib/qr-render";

const SHARE_TITLE = "DuitNow QR";

export type ExportResult = "shared" | "downloaded" | "cancelled" | "failed";

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileOrTabletViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function shouldUseNativeFileShare(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  const isTouchDevice =
    navigator.maxTouchPoints > 0 ||
    ("ontouchstart" in (typeof window !== "undefined" ? window : {}));
  if (!isTouchDevice) return false;
  if (!isIosDevice() && !isAndroidDevice()) return false;
  return isMobileOrTabletViewport();
}

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png";
  const bstr = atob(arr[1] ?? "");
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}

function canShareFile(file: File): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  const payload: ShareData = { files: [file] };
  if (typeof navigator.canShare === "function") {
    return navigator.canShare(payload);
  }
  return true;
}

export function canShareQrFiles(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") {
    return false;
  }
  try {
    const probe = new File([new Blob(["x"])], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function triggerDataUrlDownload(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function shareFile(
  file: File,
  meta?: { title?: string }
): Promise<boolean> {
  if (!canShareFile(file)) return false;

  try {
    await navigator.share({
      files: [file],
      title: meta?.title ?? SHARE_TITLE,
    });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return false;
    }
    throw error;
  }
}

export async function exportPngDataUrl(
  dataUrl: string,
  filename: string
): Promise<ExportResult> {
  try {
    if (shouldUseNativeFileShare()) {
      const file = dataUrlToFile(dataUrl, filename);
      if (canShareFile(file)) {
        const shared = await shareFile(file);
        if (shared) {
          toast.success("QR dikongsi.");
          return "shared";
        }
        return "cancelled";
      }
    }

    triggerDataUrlDownload(dataUrl, filename);
    toast.success("QR dimuat turun.");
    return "downloaded";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    toast.error("Gagal menjana QR. Sila cuba lagi.");
    return "failed";
  }
}

export async function exportZipBlob(
  blob: Blob,
  filename: string,
  count: number
): Promise<ExportResult> {
  try {
    if (shouldUseNativeFileShare()) {
      const file = new File([blob], filename, { type: "application/zip" });
      if (canShareFile(file)) {
        const shared = await shareFile(file, { title: SHARE_TITLE });
        if (shared) {
          toast.success(`${count} QR dikongsi.`);
          return "shared";
        }
        return "cancelled";
      }
    }

    triggerBlobDownload(blob, filename);
    toast.success(`${count} QR dimuat turun sebagai ZIP.`);
    return "downloaded";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    toast.error("Gagal menjana ZIP. Sila cuba lagi.");
    return "failed";
  }
}

export async function shareQrImage(
  svgElement: SVGSVGElement,
  options: QrRenderOptions,
  filename: string,
  title?: string | null
): Promise<void> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    throw new Error("Kongsi imej tidak disokong pada peranti ini.");
  }

  const dataUrl = await renderSvgToPng(svgElement, options);
  const file = dataUrlToFile(dataUrl, filename);

  if (typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
    throw new Error("Kongsi imej tidak disokong pada peranti ini.");
  }

  await navigator.share({
    files: [file],
    title: title ?? undefined,
  });
}
