import { toast } from "sonner";

import { copyQrImageToClipboard } from "@/lib/clipboard-utils";
import {
  downloadQrAsPng,
  formatShortFilename,
  type QrRenderOptions,
} from "@/lib/qr-render";
import { shareQrImage } from "@/lib/share-qr";

export type QrExportAction = "download" | "copy" | "share";

export async function runQrExportAction(
  action: QrExportAction,
  svg: SVGSVGElement,
  renderOptions: QrRenderOptions,
  merchantName: string | null
): Promise<void> {
  const filename = formatShortFilename(merchantName);

  if (action === "download") {
    await downloadQrAsPng(svg, filename, renderOptions);
    toast.success(`QR dimuat turun: ${filename}`);
    return;
  }

  if (action === "copy") {
    await copyQrImageToClipboard(svg, renderOptions);
    toast.success("QR disalin ke papan keratan.");
    return;
  }

  await shareQrImage(svg, renderOptions, filename, merchantName);
  toast.success("QR dikongsi.");
}
