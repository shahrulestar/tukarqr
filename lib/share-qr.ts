import type { QrRenderOptions } from "@/lib/qr-render";
import { renderSvgToPng } from "@/lib/qr-render";

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
  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
    throw new Error("Kongsi imej tidak disokong pada peranti ini.");
  }

  await navigator.share({
    files: [file],
    title: title ?? undefined,
  });
}
