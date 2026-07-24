"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import type { QrExportAction } from "@/lib/qr-export-actions";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface QrExportActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export function QrExportActionSheet({
  open,
  onOpenChange,
  onDownload,
  onShare,
  disabled = false,
}: QrExportActionSheetProps) {
  const t = useT();

  function handleAction(action: Extract<QrExportAction, "download" | "share">) {
    if (disabled) return;

    if (action === "download") onDownload();
    else onShare();

    onOpenChange(false);
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("export.sheet.title")}
      description={t("export.sheet.description")}
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="default"
          size="lg"
          className={cn(actionButtonClassName, "justify-center")}
          onClick={() => handleAction("download")}
          disabled={disabled}
        >
          {t("export.sheet.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(actionButtonClassName, "justify-center")}
          onClick={() => handleAction("share")}
          disabled={disabled}
        >
          {t("export.sheet.share")}
        </Button>
      </div>
    </ResponsiveModal>
  );
}
