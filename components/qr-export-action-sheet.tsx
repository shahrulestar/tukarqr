"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import type { QrExportAction } from "@/lib/qr-export-actions";
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
  function handleAction(action: Extract<QrExportAction, "download" | "share">) {
    if (disabled) return;

    onOpenChange(false);

    if (action === "download") onDownload();
    else onShare();
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Simpan QR"
      description="Simpan atau kongsi QR anda"
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
          Simpan
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(actionButtonClassName, "justify-center")}
          onClick={() => handleAction("share")}
          disabled={disabled}
        >
          Kongsi
        </Button>
      </div>
    </ResponsiveModal>
  );
}
