"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  Copy01Icon,
  Download01Icon,
  Icon,
  Settings01Icon,
  Share01Icon,
} from "@/components/ui/icon";
import { ResponsiveModal } from "@/components/responsive-modal";
import type { QrExportAction } from "@/lib/qr-export-actions";
import { cn } from "@/lib/utils";

interface QrExportActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  onCopy: () => void;
  onShare: () => void;
  onConfigOpen?: () => void;
  disabled?: boolean;
  showShare?: boolean;
}

function OptionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"];
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn(actionButtonClassName, "justify-center gap-2")}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon icon={icon} size={18} className="size-[18px]" />
      {label}
    </Button>
  );
}

export function QrExportActionSheet({
  open,
  onOpenChange,
  onDownload,
  onCopy,
  onShare,
  onConfigOpen,
  disabled = false,
  showShare = false,
}: QrExportActionSheetProps) {
  function handleAction(action: QrExportAction) {
    if (disabled) return;

    onOpenChange(false);

    if (action === "download") onDownload();
    else if (action === "copy") onCopy();
    else onShare();
  }

  function handleConfigOpen() {
    onOpenChange(false);
    onConfigOpen?.();
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Simpan QR"
      description="Muat turun, salin, atau kongsi QR anda"
    >
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="default"
          size="lg"
          className={cn(actionButtonClassName, "justify-center gap-2")}
          onClick={() => handleAction("download")}
          disabled={disabled}
        >
          <Icon icon={Download01Icon} size={18} className="size-[18px]" />
          Muat turun ke peranti
        </Button>

        <OptionButton
          icon={Copy01Icon}
          label="Salin"
          onClick={() => handleAction("copy")}
          disabled={disabled}
        />
        {showShare && (
          <OptionButton
            icon={Share01Icon}
            label="Kongsi"
            onClick={() => handleAction("share")}
            disabled={disabled}
          />
        )}
        {onConfigOpen && (
          <OptionButton
            icon={Settings01Icon}
            label="Tetapan eksport"
            onClick={handleConfigOpen}
            disabled={disabled}
          />
        )}
      </div>
    </ResponsiveModal>
  );
}
