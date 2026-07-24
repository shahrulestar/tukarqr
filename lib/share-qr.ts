import { toast } from "sonner";
import { t } from "@/lib/i18n";
import type { QrRenderOptions } from "@/lib/qr-render";
import { renderSvgToPng } from "@/lib/qr-render";

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

export function triggerBlobDownload(
  blob: Blob,
  filename: string,
  options?: { forceDownload?: boolean }
): void {
  const downloadBlob = options?.forceDownload
    ? new Blob([blob], { type: "application/octet-stream" })
    : blob;
  const url = URL.createObjectURL(downloadBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 250);
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
      title: meta?.title ?? t("export.shareQr.title"),
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
    const file = dataUrlToFile(dataUrl, filename);
    const forceDownload = isIosDevice() || isAndroidDevice();

    triggerBlobDownload(file, filename, { forceDownload });
    toast.success(t("export.toast.downloaded"));
    return "downloaded";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    toast.error(t("export.toast.renderFail"));
    return "failed";
  }
}

export async function exportZipBlob(
  blob: Blob,
  filename: string,
  count: number
): Promise<ExportResult> {
  try {
    triggerBlobDownload(blob, filename);
    toast.success(t("export.toast.zipDownloaded", { n: count }));
    return "downloaded";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    toast.error(t("export.toast.zipFail"));
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
    throw new Error(t("export.error.shareUnsupported"));
  }

  const dataUrl = await renderSvgToPng(svgElement, options);
  const file = dataUrlToFile(dataUrl, filename);

  if (typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
    throw new Error(t("export.error.shareUnsupported"));
  }

  await navigator.share({
    files: [file],
    title: title ?? t("export.shareQr.title"),
  });
}
