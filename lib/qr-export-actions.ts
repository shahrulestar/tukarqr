import { toast } from "sonner";
import { notifyExportToDiscord } from "@/lib/export-notify";
import { t } from "@/lib/i18n";
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
    void notifyExportToDiscord("save");
    return;
  }

  if (action === "copy") {
    await copyQrImageToClipboard(svg, renderOptions);
    toast.success(t("export.toast.copied"));
    return;
  }

  await shareQrImage(svg, renderOptions, filename, merchantName);
  toast.success(t("export.toast.shared"));
  void notifyExportToDiscord("share");
}
