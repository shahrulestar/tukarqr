"use client";

import { useState } from "react";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  DownloadCircle01Icon,
  Icon,
} from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { QrExportActionSheet } from "@/components/qr-export-action-sheet";
import type { QrExportAction } from "@/lib/qr-export-actions";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const exportActionButtonClassName = actionButtonClassName;

interface QrExportActionBarProps {
  onDownload: () => void;
  onCopy: () => void;
  onShare: () => void;
  onConfigOpen?: () => void;
  onRequestExport?: () => void;
  sheetOpen?: boolean;
  onSheetOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  loadingAction?: QrExportAction | null;
  disabled?: boolean;
  className?: string;
  layout?: "main" | "compact";
}

function LabelButton({
  label,
  onClick,
  isActive,
  disabled,
  variant = "outline",
  className,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="lg"
      className={cn(exportActionButtonClassName, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isActive ? <Spinner /> : label}
    </Button>
  );
}

function IconGhostButton({
  icon,
  label,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"];
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      className="shrink-0"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {isActive ? (
        <Spinner className="size-4" />
      ) : (
        <Icon icon={icon} size={16} className="size-4" />
      )}
    </Button>
  );
}

export function QrExportActionBar({
  onDownload,
  onShare,
  onRequestExport,
  sheetOpen: sheetOpenProp,
  onSheetOpenChange,
  isLoading = false,
  disabled = false,
  className,
  layout = "compact",
}: QrExportActionBarProps) {
  const t = useT();
  const [internalSheetOpen, setInternalSheetOpen] = useState(false);
  const isControlled = sheetOpenProp !== undefined;
  const sheetOpen = isControlled ? sheetOpenProp : internalSheetOpen;

  function setSheetOpen(open: boolean) {
    if (isControlled) onSheetOpenChange?.(open);
    else setInternalSheetOpen(open);
  }

  const isBusy = disabled || isLoading;

  function handleDownloadClick() {
    if (isBusy) return;
    if (onRequestExport) onRequestExport();
    else setSheetOpen(true);
  }

  const actionSheet = (
    <QrExportActionSheet
      open={sheetOpen}
      onOpenChange={setSheetOpen}
      onDownload={onDownload}
      onShare={onShare}
      disabled={disabled}
    />
  );

  if (layout === "compact") {
    return (
      <>
        <div
          className={cn(
            "flex w-auto shrink-0 ml-auto",
            className
          )}
        >
          <IconGhostButton
            icon={DownloadCircle01Icon}
            label={t("export.action.download")}
            onClick={handleDownloadClick}
            isActive={false}
            disabled={isBusy}
          />
        </div>
        {actionSheet}
      </>
    );
  }

  return (
    <>
      <div className={cn("w-full min-w-0 md:w-auto md:self-start", className)}>
        <LabelButton
          label={t("export.action.download")}
          onClick={handleDownloadClick}
          isActive={false}
          disabled={isBusy}
          variant="default"
          className="md:w-auto md:min-w-0 md:px-4"
        />
      </div>
      {actionSheet}
    </>
  );
}
